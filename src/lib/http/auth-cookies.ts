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

/**
 * 액세스 토큰의 JWT payload에서 사용자 ID인 sub를 읽습니다.
 * 서명 검증 없이 표시용 ID만 추출하며, 실제 인가는 백엔드가 Bearer 토큰으로 처리합니다.
 * @param accessToken 쿠키에서 읽은 액세스 토큰입니다.
 * @returns payload의 sub 값입니다. payload가 없거나 디코딩 또는 JSON 파싱이 실패하면 null입니다.
 */
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
