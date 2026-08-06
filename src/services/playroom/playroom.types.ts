export interface CreatePlayroomRequest {
  title: string;
  description: string;
  playlistId: number;
  hashtags: string[];
}

export interface CreatePlayroomResponse {
  id: number;
}

export interface PlayroomHost {
  userId: number;
  nickname: string;
  // 프로필 이미지가 없거나 탈퇴한 유저면 null 입니다.
  image: string | null;
}

export interface PlayroomSummary {
  id: number;
  title: string;
  description: string;
  host: PlayroomHost;
  hashtags: string[];
  isLive: boolean;
  listenerCount: number;
  createdAt: string;
}

/** 목록 카드가 실제로 사용하는 필드만 추린 타입. API 응답(PlayroomSummary)을 그대로 넘길 수 있습니다. */
export type PlayroomCardData = Pick<
  PlayroomSummary,
  'id' | 'title' | 'description' | 'hashtags' | 'listenerCount' | 'host'
>;

export interface GetPlayroomsParams {
  // 이전 응답의 nextCursor. 첫 페이지는 생략합니다.
  cursor?: string;
  // 한 페이지 개수(1~50). 생략하면 백엔드 기본값 20, 범위를 벗어나면 백엔드가 보정합니다.
  limit?: number;
}

export interface GetPlayroomsResponse {
  items: PlayroomSummary[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}
