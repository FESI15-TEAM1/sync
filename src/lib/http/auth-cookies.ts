import type { cookies } from 'next/headers';

type CookieStore = Awaited<ReturnType<typeof cookies>>;

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function setAuthCookies(cookieStore: CookieStore, tokens: AuthTokens) {
  cookieStore.set('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: tokens.expiresIn - 60 * 2,
  });

  cookieStore.set('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearAuthCookies(cookieStore: CookieStore) {
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
}

// accessToken(JWT) payload의 sub가 유저 id다. 서명 검증은 하지 않는다 —
// 실제 인가는 백엔드가 Bearer 토큰으로 다시 하므로, 여기선 "누구인지"를
// 네트워크 호출(/users/me) 없이 알아내는 용도로만 쓴다.
export function getUserIdFromAccessToken(accessToken: string | undefined) {
  const payload = accessToken?.split('.')[1];
  if (!payload) return null;

  try {
    const decoded = Buffer.from(
      payload.replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    ).toString('utf8');
    const { sub } = JSON.parse(decoded);
    return typeof sub === 'string' ? sub : null;
  } catch {
    return null;
  }
}
