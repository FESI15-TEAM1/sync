import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const BASE_URL =
  process.env.NEXT_PUBLIC_BE_API_URL ?? 'https://sync-back.store';

const REFRESH_MAX_AGE = 60 * 60 * 24 * 14;

const baseCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
};

const PROTECTED_PATH_PREFIXES = ['/search'];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// 같은 refreshToken으로 동시에 여러 요청이 들어와도 /auth/refresh는 한 번만 호출한다.
// refreshToken은 회전(rotate) 방식이라, 동시 요청이 각자 호출하면 먼저 도착한
// 하나만 성공하고 나머지는 이미 회전되어버린 토큰으로 401을 받는다.
const inFlightRefreshes = new Map<string, Promise<RefreshResult>>();

type RefreshResult =
  | { status: 'transient' }
  | { status: 'invalid' }
  | { status: 'success'; tokens: NewTokens };

interface NewTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

function refreshAccessToken(refreshToken: string): Promise<RefreshResult> {
  const inFlight = inFlightRefreshes.get(refreshToken);
  if (inFlight) return inFlight;

  const promise = requestNewTokens(refreshToken).finally(() => {
    inFlightRefreshes.delete(refreshToken);
  });
  inFlightRefreshes.set(refreshToken, promise);
  return promise;
}

async function requestNewTokens(refreshToken: string): Promise<RefreshResult> {
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

  // refreshToken이 없음/서명 불일치/만료/이미 사용됨 → 재로그인 필요
  // (/auth/refresh는 accessToken을 받지 않으므로 TOKEN_EXPIRED가 나올 일이 없다)
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
  const protectedPath = isProtectedPath(request.nextUrl.pathname);

  const loginRequiredResponse = () =>
    NextResponse.redirect(new URL('/login-required', request.url));
  // accessToken 쿠키는 로그인/refresh 시 expiresIn을 그대로 max-age로 사용하므로,
  // 쿠키가 사라졌다는 것 자체가 만료됐다는 신호다.
  if (accessToken) return NextResponse.next();

  if (!refreshToken) {
    return protectedPath ? loginRequiredResponse() : NextResponse.next();
  }

  const result = await refreshAccessToken(refreshToken);

  // 백엔드/네트워크 일시 장애: 세션은 유지하고 다음 요청에서 재시도하도록 둔다
  if (result.status === 'transient') {
    return NextResponse.next();
  }

  // refreshToken 자체가 무효 → 재로그인이 필요하므로 쿠키를 지운다
  if (result.status === 'invalid') {
    const response = protectedPath
      ? loginRequiredResponse()
      : NextResponse.next();
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  const { tokens } = result;

  // 이번 요청의 다운스트림(Server Component, Route Handler)이 곧바로 새 토큰을 보도록 반영
  request.cookies.set('accessToken', tokens.accessToken);
  request.cookies.set('refreshToken', tokens.refreshToken);

  const response = NextResponse.next({ request });

  response.cookies.set('accessToken', tokens.accessToken, {
    ...baseCookieOptions,
    maxAge: tokens.expiresIn,
  });
  response.cookies.set('refreshToken', tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge: REFRESH_MAX_AGE,
  });

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
