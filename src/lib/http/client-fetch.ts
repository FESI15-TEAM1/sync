const BASE_URL = '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string>;
  body?: unknown;
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
  { method, body }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error : ${response.status}`);
  }

  return parseJson(response);
}
