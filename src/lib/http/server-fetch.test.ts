import { cookies } from 'next/headers';

import { APIError } from './error';
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

  it('응답이 실패했을때 서버가 {error : {code , message}} 로 내려줄때 그 값이 APIError로 던져지는지 확인', async () => {
    global.fetch = jest.fn().mockRejectedValue({
      ok: false,
      status: 404,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            error: {
              code: 'PLAYLIST_NOT_FOUND',
              message: '해당 플레이리스트를 찾을 수 없습니다.',
            },
          }),
        ),
    } as Response);

    await expect(
      serverFetch('/playlist/1', { method: 'GET' }),
    ).rejects.toBeInstanceOf(APIError);
  });

  it('본문이 JSON으로 파싱 불가능하면 기본 code/message로 APIError를 던진다', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve('json이 아닙니다.'),
    } as Response);

    await expect(
      serverFetch('/playlist/1', { method: 'GET' }),
    ).rejects.toMatchObject({
      status: 400,
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 응답을 처리하는 중 오류가 발생했습니다. (400)',
    });
  });

  it('fetch 가 reject될때 502 BAD_GATEWAY로 던져지는지 확인', async () => {
    global.fetch = jest.fn().mockRejectedValue({
      ok: false,
      status: 502,
      text: () => Promise.reject('fetch요청이 실패했습니다.'),
    });

    await expect(
      serverFetch('playlists/1', { method: 'GET' }),
    ).rejects.toMatchObject({
      status: 502,
      code: 'BAD_GATEWAY',
      message: '서버와 통신 중 오류가 발생했습니다.',
    });
  });
  it('GET 요청 시 params 가 쿼리스트링으로 반영되는지 테스트', async () => {
    await serverFetch('/playlists/1', {
      method: 'GET',
      params: { cursor: 'MjA', limit: '20' },
    });
    const fetchMock = global.fetch as jest.Mock;
    const [url] = fetchMock.mock.calls[0];

    expect(url.searchParams.get('cursor')).toBe('MjA');
    expect(url.searchParams.get('limit')).toBe('20');
    expect(url.toString()).toBe(
      'https://sync-back.store/playlists/1?cursor=MjA&limit=20',
    );
  });
});
