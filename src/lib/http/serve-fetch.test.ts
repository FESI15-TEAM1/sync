import { cookies } from 'next/headers';

import { serverFetch } from './server-fetch';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;

describe('serverFetch', () => {
  beforeEach(() => {
    mockCookies.mockResolvedValue({
      get: () => undefined, // accessToken 쿠키 없음
    } as never);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ id: 1 })),
    } as Response);
  });

  it('accessToken 쿠키가 있으면 Authorization 헤더에 담아 요청한다', async () => {
    mockCookies.mockResolvedValue({
      get: () => ({ value: 'accessToken' }),
    } as never);

    await serverFetch('/playlists/1', { method: 'GET' });

    const fetchMock = global.fetch as jest.Mock;
    const [url, init] = fetchMock.mock.calls[0];

    expect(init.headers.Authorization).toBe('Bearer accessToken');
    expect(url.toString()).toBe('https://sync-back.store/playlists/1');
  });

  it('정상 응답이면 파싱된 JSON을 반환한다', async () => {
    const result = await serverFetch('/playlists/1', { method: 'GET' });

    expect(result).toEqual({ id: 1 });
  });

  it('204처럼 본문이 비어있으면 null을 반환한다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
      text: () => Promise.resolve(''),
    } as Response);

    const result = await serverFetch('playlists/1', { method: 'DELETE' });

    expect(result).toBeNull();
  });
});
