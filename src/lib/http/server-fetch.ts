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

function syncTokenCookies(
  response: Response,
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const newAccessToken = extractSetCookieValue(response, 'access_token');
  const newRefreshToken = extractSetCookieValue(response, 'refresh_token');

  if (newAccessToken) cookieStore.set('accessToken', newAccessToken);
  if (newRefreshToken) cookieStore.set('refreshToken', newRefreshToken);
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  return extractSetCookieValue(response, 'access_token') ?? null;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions,
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let response = await sendRequest(endpoint, options, accessToken);

  if (response.status === 401 && accessToken) {
    const refreshToken = cookieStore.get('refreshToken')?.value;
    const newAccessToken = refreshToken
      ? await refreshAccessToken(refreshToken)
      : null;

    if (newAccessToken) {
      cookieStore.set('accessToken', newAccessToken);
      response = await sendRequest(endpoint, options, newAccessToken);
    } else {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
    }
  }

  syncTokenCookies(response, cookieStore);

  const data = await parseJson(response);

  if (!response.ok) {
    throw new APIError(
      response.status,
      data?.error?.code ?? 'INTERNAL_SERVER_ERROR',
      data?.error?.message ?? `서버 오류가 발생했습니다. (${response.status})`,
    );
  }
  return data as T;
}
