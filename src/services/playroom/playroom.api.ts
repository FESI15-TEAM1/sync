import { clientFetch } from '@/lib/http/client-fetch';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';

import type {
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
 * 방이 재생 중인 플레이리스트의 상세(트랙 목록 포함)를 조회합니다.
 * 방 상세의 playlistId 로 호출하며, 방장이 아니어도 볼 수 있는 플레이리스트여야 합니다.
 */
export const getPlayroomPlaylist = (playlistId: number) => {
  return clientFetch<PlaylistDetail>(`/playlists/${playlistId}`, {
    method: 'GET',
  });
};
