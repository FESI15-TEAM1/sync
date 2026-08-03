import { APIError } from '@/lib/http/error';

const BASE_URL = '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  params?: Record<string, string>;
}

// 응답 바디가 비어있거나 JSON이 아닐 경우 안전하게 파싱
async function parseJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  { method, body, params }: RequestOptions = {},
): Promise<T> {
  const search = params
    ? `?${new URLSearchParams(params).toString()}`
    : '';

  const response = await fetch(`${BASE_URL}${endpoint}${search}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

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
