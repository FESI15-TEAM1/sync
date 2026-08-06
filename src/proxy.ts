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

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
} | null> {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return null;

  const newToken = await response.json().catch(() => null);

  if (
    !newToken?.accessToken ||
    !newToken?.refreshToken ||
    !newToken?.expiresIn
  ) {
    return null;
  }
  return newToken;
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // accessToken 쿠키는 로그인/refresh 시 expiresIn을 그대로 max-age로 사용하므로,
  // 쿠키가 사라졌다는 것 자체가 만료됐다는 신호다.
  if (accessToken || !refreshToken) return NextResponse.next();

  const tokens = await refreshAccessToken(refreshToken);

  if (!tokens) {
    const response = NextResponse.next();
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  // 이번 요청의 다운스트림(Server Component, Route Handler)이 곧바로 새 토큰을 보도록 반영
  request.cookies.set('accessToken', tokens.accessToken);
  request.cookies.set('refreshToken', tokens.refreshToken);

  const response = NextResponse.next({ request });
  response.cookies.set('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: tokens.expiresIn,
  });
  response.cookies.set('refreshToken', tokens.refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_MAX_AGE,
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
