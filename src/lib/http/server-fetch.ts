import { cookies } from 'next/headers';

import { APIError } from '@/lib/http/error';

const BASE_URL =
  process.env.NEXT_PUBLIC_BE_API_URL ?? 'https://sync-back.store';

interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
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

export async function serverFetch<T>(
  endpoint: string,
  options: RequestOptions,
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const response = await sendRequest(endpoint, options, accessToken);
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
