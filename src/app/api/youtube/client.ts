const BASE_URL = 'https://www.googleapis.com/youtube/v3/';

interface RequestOptions {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  params?: Record<string, string>;
}

export class YoutubeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function request<T>(
  endpoint: string,
  { method, params = {} }: RequestOptions,
): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new YoutubeApiError('유튜브 API 키가 없습니다.', 500);

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString(), { method });
  const data = await response.json();

  if (!response.ok) {
    throw new YoutubeApiError(data.error?.message ?? 'YouTube API error', response.status);
  }
  return data as T;
}
