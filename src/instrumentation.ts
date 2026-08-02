export async function register() {
  // 서버 쪽 MSW mock은 기본적으로 꺼져 있다(실제 백엔드로 요청이 나가게 하기 위함).
  // 백엔드 없이 mock으로 테스트하려면 .env.local에 MSW_ENABLED=true를 추가한다.
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NODE_ENV === 'development' &&
    process.env.MSW_ENABLED === 'true'
  ) {
    const { server } = await import('./mocks/server');

    server.listen({ onUnhandledRequest: 'bypass' });
  }
}
