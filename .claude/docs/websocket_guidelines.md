라이브 방(playroom)의 **재생 동기화·채팅·참가자**를 WebSocket으로 붙이는 방법입니다.

> 스택: Next.js(App Router) + React Query + Zustand 기준으로 예시를 들지만, 핵심은 `@stomp/stompjs` 사용법입니다.

---

## 1. 큰 그림

- 초기 상태(현재 참가자·재생 중인 곡)는 **REST `GET /playrooms/{id}`** 로 받습니다(React Query).
- 이후 변화(입퇴장·재생·채팅·종료)는 **WebSocket으로 실시간** 받습니다.
- **방 페이지 하나당 연결 하나.** 페이지 진입 시 connect, 나갈 때 disconnect.

## 2. 연결 (CONNECT 프레임 Bearer 인증)

WebSocket은 **브라우저 ↔ API 직결**입니다. BFF로 프록시할 수 없어서(Vercel 서버리스는 WebSocket을 지원하지 않음) `accessToken`이 브라우저까지 내려와야 합니다.

```tsx
import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: `${WS_BASE}/ws`,
  reconnectDelay: 5000, // 끊기면 자동 재연결(내장)

  // 연결 직전마다 실행됨 → 재연결 때도 최신 토큰을 다시 읽어온다
  beforeConnect: async () => {
    const { accessToken } = await fetch('/api/token').then((r) => r.json());
    client.connectHeaders = { Authorization: `Bearer ${accessToken}` };
  },
});

client.activate(); // 연결 시작
// ...페이지 나갈 때
client.deactivate(); // 연결 종료
```

- **`beforeConnect`를 반드시 쓰세요.** `connectHeaders`를 생성 시점에 한 번만 박아두면, 토큰이 만료된 뒤의 재연결이 전부 실패합니다. `beforeConnect`는 **재연결마다 다시 실행**되므로 이 문제가 자동으로 해결됩니다. 서버 하트비트가 10초라 재연결은 생각보다 자주 일어납니다.
- 위 예시의 `/api/token`은 **프론트 쪽 route handler**입니다 — BFF가 httpOnly 쿠키로 보관 중인 `accessToken`을 꺼내주는 용도로 직접 만드세요.
- **`refreshToken`은 절대 브라우저로 내려보내지 마세요.** `accessToken`도 메모리에만 두고 `localStorage`에 저장하지 마세요.
- **로그인 상태에서만** 연결됩니다. 헤더가 없거나 토큰이 무효/만료면 서버가 `ERROR` 프레임을 보내고 세션을 닫습니다 → `onStompError`로 감지해 토큰 재발급 후 재시도하세요.
- **`WS_BASE`는 REST API와 같은 호스트**를 쓰세요. 로컬 `ws://localhost:8080/ws`, 배포 `wss://<api-host>/ws`.
- 프론트 오리진은 서버에 **미리 등록**돼 있어야 합니다. 현재 허용: `http://localhost:3000`, `https://localhost:3000`, **`https://sync151.vercel.app`**(등록 완료).
- **프리뷰 도메인**(`sync151-<브랜치>-<팀>.vercel.app`)은 배포마다 바뀌어 기본값에 못 넣습니다. 프리뷰에서 실시간을 테스트하실 거면 알려주세요 — 등록 전까지는 연결이 거절됩니다.

## 3. 구독 (받기) — 두 개

연결되면(`onConnect`) 아래 둘을 구독합니다.

> **구독 순서는 상관없습니다.** 다만 `/user/queue/...`(개인 큐)를 **먼저** 구독하는 습관을 권합니다 — "받을 준비를 끝내고 입장한다"가 자연스럽고, 방 토픽 구독이 곧 서버 입장 신호이기 때문입니다.

```tsx
client.onConnect = () => {
  // (1) 나에게만 오는 접속 직후 스냅샷(1회)
  client.subscribe(`/user/queue/playrooms/${roomId}`, (msg) => {
    const s = JSON.parse(msg.body);
    // s = { type:'sync_state', playback, members, listenerCount }
    // 현재 전체 참가자 + 재생 상태로 초기화(REST 스냅샷 대신/보강용)
  });

  // (2) 방 전체 브로드캐스트 — 이 구독이 서버에는 '입장' 신호입니다
  client.subscribe(`/topic/playrooms/${roomId}`, (msg) => {
    const e = JSON.parse(msg.body);
    switch (e.type) {
      case 'member_joined': // { member, listenerCount } — 참가자 추가
      case 'member_left': // { member, listenerCount } — 참가자 제거
        // 참가자 목록/인원수 갱신
        break;
      case 'playback_sync': // { videoId, isPlaying, currentTime, updatedAt } — 재생 상태
        // 플레이어를 이 상태로 맞춤(아래 5-2 지연 보정)
        break;
      case 'chat_message': // { id, sender, message, createdAt }
        // 채팅에 append
        break;
      case 'room_closed': // {} — 방장이 종료 → 방에서 내보내기(스테이지로 이동)
        break;
    }
  });
};
```

- **`sync_state`가 안 온다면** 먼저 `roomId`를 확인하세요. 서버는 `/topic/playrooms/{숫자}` 형태만 방 구독으로 인식합니다 — `undefined`가 들어가거나 뒤에 슬래시가 붙으면 **입장 처리 자체가 안 되고**(에러도 안 남) `member_joined`도 오지 않습니다.

## 4. 전송 (보내기)

### 4-1. 채팅 (누구나)

```tsx
client.publish({
  destination: `/app/playrooms/${roomId}/chat`,
  body: JSON.stringify({ message: '안녕하세요!' }),
});
// → 서버가 저장 + 모두에게 chat_message 브로드캐스트(내 화면에도 그때 옴)
```

### 4-2. 재생 컨트롤 (**방장만**)

```tsx
client.publish({
  destination: `/app/playrooms/${roomId}/playback`,
  body: JSON.stringify({ videoId, isPlaying, currentTime }), // 초 단위(예: 83.2)
});
```

- **방장이 아니면 서버가 무시**합니다(브로드캐스트 안 됨). 방장이 재생/일시정지/시크할 때 보내세요.
- **참가자(비방장)는 `playback_sync`를 받아 따라가기만** 합니다. 지연 보정:

  ```tsx
  // playback_sync 수신 시, 재생 중이면 그동안 흐른 시간만큼 보정해서 seek
  const elapsed = (Date.now() - new Date(e.updatedAt).getTime()) / 1000;
  const seekTo = e.isPlaying ? e.currentTime + elapsed : e.currentTime;
  ```

- **재생 순서(다음 곡)는 방이 튼 플레이리스트 순서** 그대로입니다(WS로 큐를 따로 안 보냄). `GET /playrooms/{id}`의 `playlistId`로 플레이리스트를 받아 순서를 쓰세요.
