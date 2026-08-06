import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const BASE_URL =
  process.env.NEXT_PUBLIC_BE_API_URL ?? 'https://sync-back.store';

const REFRESH_MAX_AGE = 60 * 60 * 24 * 14;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: REFRESH_MAX_AGE,
};

async function refreshAccessToken(refreshToken: string) {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return { status: 'transient' };
  }

  // 401 = refreshToken이 무효/만료/이미 사용됨 → 재로그인이 실제로 필요한 케이스
  if (response.status === 401) return { status: 'invalid' };
  if (!response.ok) return { status: 'transient' };

  const newToken = await response.json().catch(() => null);

  if (
    !newToken?.accessToken ||
    !newToken?.refreshToken ||
    !newToken?.expiresIn
  ) {
    return { status: 'transient' };
  }
  return { status: 'success', tokens: newToken };
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // accessToken 쿠키는 로그인/refresh 시 expiresIn을 그대로 max-age로 사용하므로,
  // 쿠키가 사라졌다는 것 자체가 만료됐다는 신호다.
  if (accessToken || !refreshToken) return NextResponse.next();

  const result = await refreshAccessToken(refreshToken);

  // 백엔드/네트워크 일시 장애: 세션은 유지하고 다음 요청에서 재시도하도록 둔다
  // TODO: 백엔드가 TOKEN_EXPIRED/UNAUTHORIZED 코드를 안정적으로 내려주면
  // 'invalid' 상태에서만 쿠키를 지우도록 다시 분기한다. 그 전까지는 401도
  // 세션을 유지한 채 다음 요청에서 재시도한다.
  if (result.status === 'transient' || result.status === 'invalid') {
    return NextResponse.next();
  }

  const { tokens } = result;

  // 이번 요청의 다운스트림(Server Component, Route Handler)이 곧바로 새 토큰을 보도록 반영
  request.cookies.set('accessToken', tokens.accessToken);
  request.cookies.set('refreshToken', tokens.refreshToken);

  const response = NextResponse.next({ request });
  response.cookies.set('accessToken', tokens.accessToken, {
    ...cookieOptions,
  });
  response.cookies.set('refreshToken', tokens.refreshToken, {
    ...cookieOptions,
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
