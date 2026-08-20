import { clientFetch } from '@/lib/http/client-fetch';

import type {
  GetPlayroomMessagesParams,
  GetPlayroomMessagesResponse,
} from './playroomMessage.types';

/**
 * 방의 채팅 과거 기록을 최신순으로 조회합니다.
 * 방에 늦게 들어와도 이전 대화를 볼 수 있도록, WebSocket 연결과 별개로 한 번 불러옵니다.
 */
export const getPlayroomMessages = (
  playroomId: number,
  { cursor, limit }: GetPlayroomMessagesParams = {},
) => {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  // 잘못된 limit 이 조용히 기본값으로 바뀌지 않도록, 값이 있으면 그대로 보내 라우트에서 검증받습니다.
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetPlayroomMessagesResponse>(
    `/playrooms/${playroomId}/messages`,
    {
      method: 'GET',
      params: Object.keys(params).length > 0 ? params : undefined,
    },
  );
};
