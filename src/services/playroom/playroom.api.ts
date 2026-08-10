import { clientFetch } from '@/lib/http/client-fetch';

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
