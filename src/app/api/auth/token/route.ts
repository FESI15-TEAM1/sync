import { cookies } from 'next/headers';

// STOMP(WebSocket)처럼 브라우저에서 직접 Authorization 헤더를 붙여야 하는 경우에만 사용한다.
// 일반 API 호출은 라우트 핸들러가 서버에서 토큰을 붙이므로 이 엔드포인트가 필요 없다.
//
// accessToken 쿠키의 max-age는 expiresIn과 같으므로 쿠키가 없다는 것은 만료됐다는 뜻이다.
// 갱신은 proxy에서 refreshToken으로 미리 처리되므로,
// 여기까지 왔는데도 쿠키가 없다면 재로그인이 필요한 상태다.
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return Response.json(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: '다시 로그인해주세요.',
        },
      },
      {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }

  return Response.json(
    { accessToken },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
