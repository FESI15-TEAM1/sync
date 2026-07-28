// 백엔드 없이 채팅 UI를 테스트하기 위한 목(mock) STOMP 서버입니다.
// 실행: npm run dev:ws  →  ws://localhost:8080/ws
//
// Spring 규칙을 흉내냅니다.
//   구독: /sub/playroom/{playroomId}
//   발행: /pub/playroom/{playroomId}/chat  → 같은 방 구독자 전원에게 브로드캐스트
import { WebSocketServer } from 'ws';

const PORT = 8080; // 웹소켓 서버 포트
const NULL = '\0'; // STOMP 프레임 바디 종료 문자 설정

// socket -> { username, subscriptions: Map<subscriptionId, destination> }
const clients = new Map();
let guestCount = 0; // 게스트 넘버링 지정

function buildFrame(command, headers, body = '') {
  // 프레임 생성: 프레임이란 STOMP 프로토콜에서 메시지를 주고받기 위한 단위입니다. 각 프레임은 명령어, 헤더, 바디로 구성됩니다.
  const headerLines = Object.entries(headers).map(([k, v]) => `${k}:${v}`);
  return `${command}\n${headerLines.join('\n')}\n\n${body}${NULL}`;
}

function parseFrame(raw) {
  // STOMP 프레임 파싱: 수신된 STOMP 프레임을 명령어, 헤더, 바디로 분리합니다.
  const [head, ...bodyParts] = raw.split('\n\n');
  const [command, ...headerLines] = head.split('\n');
  const headers = Object.fromEntries(
    headerLines.filter(Boolean).map((line) => {
      const index = line.indexOf(':');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
  );
  return { command, headers, body: bodyParts.join('\n\n') };
}

function broadcast(destination, payload) {
  // 브로드캐스트: 특정 목적지(destination)에 메시지를 발행하면, 해당 목적지를 구독한 모든 클라이언트에게 메시지를 전송합니다.
  let messageId = 0;

  for (const [socket, client] of clients) {
    for (const [subscriptionId, subscribed] of client.subscriptions) {
      if (subscribed !== destination) continue;

      socket.send(
        buildFrame(
          'MESSAGE',
          {
            destination,
            subscription: subscriptionId,
            'message-id': `${Date.now()}-${messageId++}`,
            'content-type': 'application/json',
          },
          JSON.stringify(payload),
        ),
      );
    }
  }
}

// 웹소켓 서버 생성: 지정된 포트와 경로에서 WebSocket 서버를 시작합니다.
const server = new WebSocketServer({ port: PORT, path: '/ws' });

server.on('connection', (socket) => {
  // 새로운 클라이언트 연결 처리: 클라이언트가 연결되면 고유한 게스트 이름을 부여하고, 클라이언트 정보를 저장합니다.
  const username = `게스트${++guestCount}`;
  clients.set(socket, { username, subscriptions: new Map() });
  console.log(`[연결] ${username} (현재 ${clients.size}명)`);

  let buffer = '';

  socket.on('message', (data) => {
    buffer += data.toString();

    // STOMP 프레임은 NULL 문자로 끝납니다. 마지막 조각은 미완성이므로 버퍼에 남겨둡니다.
    const frames = buffer.split(NULL);
    buffer = frames.pop() ?? '';

    for (const raw of frames) {
      const trimmed = raw.replace(/^[\r\n]+/, ''); // 하트비트로 온 개행 제거, 하트비트란: 클라이언트와 서버 간의 연결 상태를 확인하기 위해 주기적으로 보내는 신호입니다.
      if (!trimmed) continue;

      const { command, headers, body } = parseFrame(trimmed);
      const client = clients.get(socket);

      switch (command) {
        case 'CONNECT':
        case 'STOMP':
          socket.send(
            buildFrame('CONNECTED', {
              version: '1.2',
              'heart-beat': '0,0',
              user: client.username,
            }),
          );
          break;

        case 'SUBSCRIBE':
          client.subscriptions.set(headers.id, headers.destination);
          console.log(`[구독] ${client.username} → ${headers.destination}`);
          break;

        case 'UNSUBSCRIBE':
          client.subscriptions.delete(headers.id);
          break;

        case 'SEND': {
          // /pub/playroom/{id}/chat → /sub/playroom/{id}
          const playroomId = headers.destination.match(
            /^\/pub\/playroom\/([^/]+)\/chat$/,
          )?.[1];
          if (!playroomId) {
            console.log(`[무시] 알 수 없는 목적지 ${headers.destination}`);
            break;
          }

          const { message } = JSON.parse(body);
          console.log(`[채팅] ${playroomId}방 ${client.username}: ${message}`);
          broadcast(`/sub/playroom/${playroomId}`, {
            username: client.username,
            message,
          });
          break;
        }

        case 'DISCONNECT':
          if (headers.receipt) {
            socket.send(
              buildFrame('RECEIPT', { 'receipt-id': headers.receipt }),
            );
          }
          socket.close();
          break;
      }
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
    console.log(`[해제] ${username} (현재 ${clients.size}명)`);
  });
});

console.log(`목 STOMP 서버 실행 중 → ws://localhost:${PORT}/ws`);
