import { cookies } from 'next/headers';

import { APIError } from '@/lib/http/error';

const BASE_URL = 'https://sync-back.store';

interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  params?: Record<string, string>;
  body?: unknown;
}

function sendRequest(
  endpoint: string,
  { method, params = {}, body }: RequestOptions,
  accessToken?: string,
) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );

  return fetch(url, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function parseJson(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

// 로컬 개발(http)에서는 Secure 쿠키가 저장되지 않고 즉시 사라지므로,
// 배포 환경(https)에서만 Secure를 붙이도록 명시적으로 분기한다.
const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const ACCESS_TOKEN_COOKIE = {
  ...COOKIE_BASE,
  maxAge: 60 * 30, // 30분
};

const REFRESH_TOKEN_COOKIE = {
  ...COOKIE_BASE,
  maxAge: 60 * 60 * 24 * 14, // 14일
};

// 백엔드는 로그인/리프레시 시 토큰을 body가 아니라 응답의 Set-Cookie
// (access_token / refresh_token, snake_case)로 내려준다. 우리 서버가 백엔드와
// 직접 통신하므로 이 쿠키는 브라우저로 자동 전달되지 않아, 값을 직접 꺼내
// 우리 도메인의 accessToken/refreshToken 쿠키로 다시 심어줘야 한다.
function extractSetCookieValue(response: Response, name: string) {
  const setCookieHeaders = response.headers.getSetCookie();

  for (const header of setCookieHeaders) {
    const [pair] = header.split(';');
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) continue;

    if (pair.slice(0, separatorIndex).trim() === name) {
      return decodeURIComponent(pair.slice(separatorIndex + 1).trim());
    }
  }

  return undefined;
}

function syncTokenCookies(response: Response, cookieStore: CookieStore) {
  const newAccessToken = extractSetCookieValue(response, 'access_token');
  const newRefreshToken = extractSetCookieValue(response, 'refresh_token');

  if (newAccessToken) {
    cookieStore.set('accessToken', newAccessToken, ACCESS_TOKEN_COOKIE);
  }
  if (newRefreshToken) {
    cookieStore.set('refreshToken', newRefreshToken, REFRESH_TOKEN_COOKIE);
  }
}

export function clearTokenCookies(cookieStore: CookieStore) {
  cookieStore.delete({ name: 'accessToken', path: '/' });
  cookieStore.delete({ name: 'refreshToken', path: '/' });
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<Response | null> {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  return response;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions,
): Promise<T> {
  const cookieStore = await cookies();

  // 현재 저장된 access token
  const accessToken = cookieStore.get('accessToken')?.value;

  // 최초 API 요청
  let response = await sendRequest(endpoint, options, accessToken);

  // access token 만료
  if (response.status === 401 && accessToken) {
    // refresh token 가져오기
    const refreshToken = cookieStore.get('refreshToken')?.value;

    // refresh token으로 access token 재발급
    const refreshResponse = refreshToken
      ? await refreshAccessToken(refreshToken)
      : null;

    if (refreshResponse) {
      // 백엔드가 내려준
      // access_token / refresh_token을 모두 저장
      syncTokenCookies(refreshResponse, cookieStore);

      // 새 access token 추출
      const newAccessToken = extractSetCookieValue(
        refreshResponse,
        'access_token',
      );

      if (newAccessToken) {
        // 새 access token으로 원래 요청 재시도
        response = await sendRequest(endpoint, options, newAccessToken);
      } else {
        // refresh 응답에 access token이 없는 경우
        clearTokenCookies(cookieStore);
      }
    } else {
      // refresh 요청 실패
      clearTokenCookies(cookieStore);
    }
  }

  // 일반 API 응답 또는 로그인 응답에서
  // Set-Cookie가 있다면 쿠키 동기화
  syncTokenCookies(response, cookieStore);

  // 응답 JSON 파싱
  const data = await parseJson(response);

  // API 에러 처리
  if (!response.ok) {
    throw new APIError(
      response.status,
      data?.error?.code ?? 'INTERNAL_SERVER_ERROR',
      data?.error?.message ?? `서버 오류가 발생했습니다. (${response.status})`,
    );
  }

  return data as T;
}
