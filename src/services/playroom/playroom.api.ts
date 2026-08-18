import { MAIN_PLAYROOM_COUNT } from '@/constants/playroom';
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
 * 메인에 노출할 라이브 플레이룸을 청취자 많은 순(같으면 최신순)으로 조회합니다.
 * 라이브 여부는 "방장이 지금 접속해 있는가"라 목록 정렬과 무관하므로,
 * 전체 목록을 받아 클라이언트에서 거르지 않고 서버가 걸러주는 전용 엔드포인트를 씁니다.
 * 커서를 쓰지 않는 엔드포인트라 nextCursor 는 항상 null 입니다.
 */
export const getMainPlayrooms = (limit: number = MAIN_PLAYROOM_COUNT) => {
  return clientFetch<GetPlayroomsResponse>('/playrooms/live', {
    method: 'GET',
    params: { limit: String(limit) },
  });
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
