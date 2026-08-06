import { clientFetch } from '@/lib/http/client-fetch';

import type {
  CreatePlayroomRequest,
  CreatePlayroomResponse,
  GetPlayroomsParams,
  GetPlayroomsResponse,
} from './playroom.types';

export const postPlayroom = (form: CreatePlayroomRequest) => {
  return clientFetch<CreatePlayroomResponse>('/playrooms', {
    method: 'POST',
    body: form,
  });
};

export const getPlayrooms = ({ cursor, limit }: GetPlayroomsParams = {}) => {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit) params.limit = String(limit);

  return clientFetch<GetPlayroomsResponse>('/playrooms', {
    method: 'GET',
    params: Object.keys(params).length > 0 ? params : undefined,
  });
};
