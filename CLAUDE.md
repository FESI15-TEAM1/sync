# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 프로젝트

Sync — 스트리밍 플랫폼의 플레이리스트를 공유하고, 라이브 방(playroom)에서 함께 듣는 서비스.
Next.js 16 App Router + React 19 + TypeScript(strict) + Tailwind v4. Node >= 24.

한국어 제품입니다. UI 문구, 코드 주석, API 에러 메시지 모두 한국어로 작성합니다.

## 명령어

```bash
npm run dev          # 개발 서버 (Next 16 기본 Turbopack)
npm run dev:https    # HTTPS 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # eslint (flat config)
```

husky pre-commit 훅과 CI가 같은 검사를 돌린 뒤 Vercel로 배포합니다(PR은 preview, main push는 production). `npm run prepare`로 훅을 설치합니다.

## 아키텍처

### 요청 흐름 (핵심 패턴)

브라우저는 백엔드와 직접 통신하지 않습니다. BFF 구조로 항상 아래 경로를 거칩니다.

```
컴포넌트 → TanStack Query 훅 → 서비스의 *.api 함수 → clientFetch
        → 이 앱의 route handler → serverFetch → 백엔드
```

- **`clientFetch`** — 브라우저 전용. base가 `/api`라서 이 앱의 route handler에만 도달합니다. 응답의 `{ error: { code, message } }` 봉투를 파싱해 `APIError`를 던집니다.
- **`serverFetch`** — route handler와 서버 컴포넌트 전용. 쿠키에서 accessToken을 읽어 Bearer 헤더로 붙입니다. 클라이언트 컴포넌트에서 호출할 수 없습니다.
- **`APIError(status, code, message)`** — 두 경계를 모두 넘나드는 단일 에러 타입.

**route handler는 모두 같은 모양**입니다. `try` 안에서 `serverFetch`를 호출하고, `catch`에서 `APIError`면 그 status로 `{ error: { code, message } }` 봉투를, 아니면 500 봉투를 돌려줍니다. 이 봉투 모양을 그대로 유지하세요 — `clientFetch`가 정확히 이 형태를 파싱하므로 어긋나면 클라이언트 에러 메시지가 깨집니다.

서비스 계층은 도메인별 디렉토리에 `*.api`(clientFetch/serverFetch를 감싼 얇은 함수)와 `*.types`(요청/응답 타입)로 나눠 둡니다. 응답 데이터는 항상 타입을 붙입니다.

백엔드 엔드포인트 모양은 `.claude/docs/`의 OpenAPI 스펙에서 확인합니다. **스키마·경로·상태 코드 등 구조만 참고하고, 스펙에 들어 있는 example 데이터는 실제 값이 아니므로 무시하세요.**

### 인증

httpOnly 쿠키 기반이며 토큰은 클라이언트 JS에 노출되지 않습니다.

- 로그인/소셜 콜백 route handler가 서버에서 `accessToken`·`refreshToken` 쿠키를 설정합니다.
- **토큰 갱신은 proxy(Next 16에서 middleware를 대체하는 진입점)에서 선제적으로 처리**합니다. `accessToken` 쿠키의 max-age가 `expiresIn`과 같으므로, 쿠키가 없으면 만료된 것으로 보고 `refreshToken`으로 갱신한 뒤 이번 요청의 다운스트림과 응답 쿠키 양쪽에 반영합니다. refreshToken은 회전(rotate) 방식이라 동시 요청이 각각 갱신하면 실패하므로, 같은 토큰에 대한 갱신 요청은 in-flight 맵으로 하나만 나갑니다. 네트워크 일시 장애면 세션을 유지하고, refreshToken 자체가 무효면 쿠키를 지웁니다.
- 예외적으로 WebSocket 연결 헤더용으로만 accessToken을 꺼내오는 route handler가 있습니다. `refreshToken`은 절대 브라우저로 내보내지 않고, accessToken도 저장하지 않고 연결 직전에만 씁니다.

### 데이터 페칭 — TanStack Query로 고정

클라이언트 데이터 페칭은 **TanStack Query로 통일**합니다. 컴포넌트에서 `*.api` 함수를 직접 `await` 하지 마세요.

- `QueryProvider`가 루트 레이아웃에서 `QueryClient`를 `useState` 초기화로 한 번만 만들어 감쌉니다(기본값: `staleTime` 60초, `retry` 1).
- 쿼리는 훅으로 감싸 재사용합니다. 여러 라우트가 쓰면 공용 훅 디렉토리에, 한 라우트 전용이면 그 라우트의 `_hooks/`에 둡니다.
- **쿼리 키는 훅과 같은 모듈에서 팩토리 함수로 export**하고(`as const`), 무효화하는 쪽에서 그 팩토리를 import해 씁니다. 키 배열을 손으로 다시 적지 마세요.
- 변경 작업은 `useMutation` + `invalidateQueries`로 서버 상태를 다시 받아옵니다.

### 실시간 (playroom)

라이브 방은 STOMP over WebSocket(`@stomp/stompjs`)으로 붙습니다. Vercel 서버리스가 WebSocket을 지원하지 않아 **이 경로만 브라우저 ↔ 백엔드 직결**입니다.

- 초기 스냅샷(참가자, 재생 중인 곡)은 REST(방 상세 쿼리)로 받고, 이후 변화만 WebSocket으로 받습니다. **방 페이지 하나당 연결 하나** — 진입 시 activate, 이탈 시 deactivate.
- 연결 시 `beforeConnect`에서 매번 accessToken을 새로 읽어 `connectHeaders`에 넣습니다. 생성 시점에 한 번만 박으면 재연결이 전부 실패합니다.
- 구독은 둘입니다. 개인 큐(`/user/queue/playrooms/{id}`)로 접속 직후 `sync_state` 스냅샷 1회, 방 토픽(`/topic/playrooms/{id}`)으로 `member_joined` / `member_left` / `playback_sync` / `chat_message` / `room_closed` 브로드캐스트. 방 토픽 구독 자체가 서버에는 입장 신호입니다.
- 전송은 채팅(`/app/playrooms/{id}/chat`, 누구나)과 재생 컨트롤(`/app/playrooms/{id}/playback`, 방장만)입니다.
- **역할 분담 원칙**: 참가자 목록·곡 메타데이터처럼 REST가 들고 있는 것은 WebSocket 이벤트로 쌓지 않고 쿼리를 무효화해 다시 받아옵니다. 재생 위치·채팅 스트림처럼 순간적인 것만 로컬 state로 둡니다.
- 재생 동기화는 이벤트의 `updatedAt`으로 수신까지의 지연을 보정해 플레이어를 맞춥니다.

자세한 프로토콜은 `.claude/docs/`의 WebSocket 가이드 문서를 참고하세요.

### 클라이언트 상태 (Zustand)

모듈 레벨 싱글턴이 아니라 **SSR 안전한 context-provider 패턴**을 씁니다.

vanilla `createStore()` 팩토리 → `'use client'` provider 안에서 `useState(() => createXStore())`로 요청당 1회 생성 → React Context로 노출 → provider 밖에서 호출하면 throw하는 `useXStore(selector)` 훅으로 소비.

새 전역 클라이언트 상태도 이 패턴을 따릅니다. 서버에서 온 데이터는 여기 복사해두지 말고 TanStack Query가 소유하게 둡니다.

### 컴포넌트와 라우팅

- 제네릭 UI와 도메인 프레젠테이션 컴포넌트는 공용 컴포넌트 디렉토리에서 분리합니다.
- 라우트 전용 조각은 해당 라우트 옆 `_components/`, 훅은 `_hooks/`에 둡니다.
- 라우트 그룹으로 인증 화면과 메인 화면을 나눕니다.
- 공용 폼 필드 스타일은 clsx + tailwind-merge로 만든 단일 class 상수를 export해 필드 컴포넌트들이 조합합니다 — 클래스 문자열을 복붙하지 마세요.
- **React Compiler가 켜져 있습니다** — 특별한 이유가 없으면 수동 `useMemo`/`useCallback`은 쓰지 않습니다.
- SVG는 `@svgr/webpack`으로 React 컴포넌트로 import됩니다. 외부 이미지 호스트는 Next 설정의 `remotePatterns`에 등록해야 합니다.

## 컨벤션

- import 순서는 `eslint-plugin-simple-import-sort`가 자동 정렬합니다(손으로 알파벳순 정리하지 마세요). `@typescript-eslint/consistent-type-imports`가 error이므로 타입은 `import { type Foo } from '...'` 형태로.
- Prettier: 홑따옴표, 세미콜론, 트레일링 콤마, 2칸 들여쓰기. `prettier-plugin-tailwindcss`가 클래스명을 정렬합니다.
- 경로 alias는 `@/*` → `src/*` 하나뿐입니다.
- 네이밍(CodeRabbit 리뷰에서도 검사): 컴포넌트 PascalCase, 훅 `use`+camelCase, API 함수 동사+명사 camelCase, 상수 SCREAMING_SNAKE_CASE, 핸들러 `handle*`, 불리언 `is`/`has`.
