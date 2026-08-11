import { type PlayroomHost } from './playroom.types';

/** 방장(host)과 동일한 유저 요약 스키마(UserSummaryResponse)입니다. */
type MessageSender = PlayroomHost;

export interface PlayroomMessageResponse {
  id: number;
  sender: MessageSender;
  message: string;
  // ISO 8601 UTC
  createdAt: string;
}

/** 한 페이지 개수의 허용 범위. 벗어난 값은 백엔드가 임의로 보정하므로 요청 전에 걸러냅니다. */
export const PLAYROOM_MESSAGE_LIMIT_MIN = 1;
export const PLAYROOM_MESSAGE_LIMIT_MAX = 50;

export interface GetPlayroomMessagesParams {
  // 이전 응답의 nextCursor. 첫 페이지는 생략합니다.
  cursor?: string;
  // 한 페이지 개수(1~50). 생략하면 백엔드 기본값 20 입니다.
  limit?: number;
}

export interface GetPlayroomMessagesResponse {
  // 최신순(내림차순)으로 내려옵니다.
  items: PlayroomMessageResponse[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}
