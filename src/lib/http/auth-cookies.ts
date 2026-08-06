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
    maxAge: tokens.expiresIn,
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
