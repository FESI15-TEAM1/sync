import { clientFetch } from '@/lib/http/client-fetch';

import type {
  PlayroomDetailResponse,
  PlayroomUpdateRequest,
} from './playroomDetail.types';

export const getPlayroomDetail = (playroomId: number) => {
  return clientFetch<PlayroomDetailResponse>(`/playrooms/${playroomId}`, {
    method: 'GET',
  });
};

/** 방 제목·설명·해시태그를 수정합니다. 방장만 호출할 수 있으며 수정된 방 상세를 돌려줍니다. */
export const patchPlayroom = (
  playroomId: number,
  form: PlayroomUpdateRequest,
) => {
  return clientFetch<PlayroomDetailResponse>(`/playrooms/${playroomId}`, {
    method: 'PATCH',
    body: form,
  });
};

/** 방송을 종료하고 방을 삭제합니다. 방장만 호출할 수 있으며 응답 본문은 없습니다. */
export const deletePlayroom = (playroomId: number) => {
  return clientFetch<null>(`/playrooms/${playroomId}`, {
    method: 'DELETE',
  });
};
