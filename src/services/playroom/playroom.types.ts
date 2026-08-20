export interface PlayroomCreateRequest {
  title: string;
  description: string;
  playlistId: number;
  hashtags: string[];
}

export interface PlayroomCreateResponse {
  id: number;
}

export interface PlayroomHost {
  userId: number;
  nickname: string;
  // 프로필 이미지가 없거나 탈퇴한 유저면 null 입니다.
  image: string | null;
}

export interface PlayroomListItemResponse {
  id: number;
  title: string;
  description: string;
  hashtags: string[];
  isLive: boolean;
  listenerCount: number;
  host: PlayroomHost;
  createdAt: string;
}

/** 목록 카드가 실제로 사용하는 필드만 추린 타입. API 응답(PlayroomListItemResponse)을 그대로 넘길 수 있습니다. */
export type PlayroomCardData = Pick<
  PlayroomListItemResponse,
  | 'id'
  | 'title'
  | 'description'
  | 'hashtags'
  | 'listenerCount'
  | 'host'
  | 'isLive'
  | 'createdAt'
>;

/** 한 페이지 개수의 허용 범위. 벗어난 값은 백엔드가 임의로 보정하므로 요청 전에 걸러냅니다. */
export const PLAYROOM_LIMIT_MIN = 1;
export const PLAYROOM_LIMIT_MAX = 50;

export interface GetPlayroomsParams {
  // 이전 응답의 nextCursor. 첫 페이지는 생략합니다.
  cursor?: string;
  // 한 페이지 개수(1~50). 생략하면 백엔드 기본값 20이고, 범위를 벗어나거나 정수가 아니면 400 으로 거부됩니다.
  limit?: number;
}

export interface GetPlayroomsResponse {
  items: PlayroomListItemResponse[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}

/**
 * 내가 만든 플레이룸 목록 응답.
 * 개설 상한이 5개라 페이지가 나뉘지 않아 nextCursor 는 항상 null 이지만,
 * 다른 목록 API 와 형태를 맞추기 위해 껍데기를 그대로 유지합니다.
 * 항목의 isLive 는 "내가 그 방에 접속해 있는지"이며, false 면 자리를 비운 상태입니다.
 */
export type GetMyPlayroomsResponse = GetPlayroomsResponse;

/** 한 사람이 개설할 수 있는 플레이룸 최대 개수. */
export const MY_PLAYROOM_MAX_COUNT = 5;
