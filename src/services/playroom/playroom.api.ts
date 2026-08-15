import { clientFetch } from '@/lib/http/client-fetch';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';

import type {
  GetMyPlayroomsResponse,
  GetPlayroomsParams,
  GetPlayroomsResponse,
  PlayroomCreateRequest,
  PlayroomCreateResponse,
} from './playroom.types';

export const postPlayroom = (form: PlayroomCreateRequest) => {
  return clientFetch<PlayroomCreateResponse>('/playrooms', {
    method: 'POST',
    body: form,
  });
};

export const getPlayrooms = ({ cursor, limit }: GetPlayroomsParams = {}) => {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  // 잘못된 limit 이 조용히 기본값으로 바뀌지 않도록, 값이 있으면 그대로 보내 라우트에서 검증받습니다.
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetPlayroomsResponse>('/playrooms', {
    method: 'GET',
    params: Object.keys(params).length > 0 ? params : undefined,
  });
};

/**
 * 라이브 중(isLive === true)인 플레이룸만 추려서 조회합니다.
 * 백엔드에 isLive 필터 파라미터가 없어, 목록을 받아온 뒤 클라이언트에서 걸러냅니다.
 * 필터링은 받아온 페이지 안에서만 일어나므로 nextCursor 는 원본 응답 값을 그대로 넘깁니다.
 */
export const getMainPlayrooms = async (
  params: GetPlayroomsParams = {},
): Promise<GetPlayroomsResponse> => {
  const data = await getPlayrooms(params);

  return {
    ...data,
    items: data.items.filter((playroom) => playroom.isLive),
  };
};

/**
 * 내가 방장인 플레이룸을 최신순으로 조회합니다. 회원 전용이라 비회원이면 401 입니다.
 * 개설 상한(5개)이 한 페이지를 넘지 않아 커서 파라미터가 없습니다.
 */
export const getMyPlayrooms = () => {
  return clientFetch<GetMyPlayroomsResponse>('/playrooms/me', {
    method: 'GET',
  });
};

/**
 * 방이 재생 중인 플레이리스트의 상세(트랙 목록 포함)를 조회합니다.
 * 방 상세의 playlistId 로 호출하며, 방장이 아니어도 볼 수 있는 플레이리스트여야 합니다.
 */
export const getPlayroomPlaylist = (playlistId: number) => {
  return clientFetch<PlaylistDetail>(`/playlists/${playlistId}`, {
    method: 'GET',
  });
};
