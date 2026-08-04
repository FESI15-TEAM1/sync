import { APIError } from './error';

const BASE_URL = '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string>;
  body?: unknown;
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

export async function apiClient<T>(
  endpoint: string,
  { method = 'GET', params, body }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(
    `${BASE_URL}${endpoint}${params ? '?' + new URLSearchParams(params) : ''}`,
    { method, body: JSON.stringify(body) },
  );
  const data = await parseJson(response);

  if (!response.ok) {
    throw new APIError(
      response.status,
      data?.error?.code ?? 'INTERNAL_SERVER_ERROR',
      data?.error?.message ?? `서버 오류가 발생했습니다. (${response.status})`,
    );
  }

  return data;
}
