import { cookies } from 'next/headers';

import { APIError } from '@/lib/api/error';

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

async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.accessToken as string;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions,
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let response = await sendRequest(endpoint, options, accessToken);

  if (response.status === 401) {
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

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(
      response.status,
      data.error?.code ?? 'INTERNAL_SERVER_ERROR',
      data.error?.message ?? '서버 오류가 발생했습니다.',
    );
  }
  return data as T;
}
