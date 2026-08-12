export type responseNotificationsUnreadCountType = {
  count: number;
};
export interface NotificationActor {
  userId: number;
  nickname: string;
  image: string | null;
}

interface NotificationBase {
  id: number;
  actor: NotificationActor;
  // 여러 명이 묶이는 경우("○○ 외 8인") 집계 인원 수, actor는 대표 1명
  actorCount: number;
  isRead: boolean;
  createdAt: string;
}

// 내 플레이리스트에 댓글
export interface PlaylistCommentNotification extends NotificationBase {
  type: 'PLAYLIST_COMMENT';
  sourceType: 'playlist';
  sourceId: number;
}

// 내 플레이리스트에 좋아요
export interface PlaylistLikeNotification extends NotificationBase {
  type: 'PLAYLIST_LIKE';
  sourceType: 'playlist';
  sourceId: number;
}

// 누군가 나를 팔로우
export interface FollowNotification extends NotificationBase {
  type: 'FOLLOW';
  sourceType: 'user';
  sourceId: number;
}

// 내가 팔로우한 유저가 라이브(playroom) 시작 — 클릭 시 방이 이미 종료됐을 수 있음(404 대비, "이미 끝난 방송" 안내)
export interface FollowedLiveNotification extends NotificationBase {
  type: 'FOLLOWED_LIVE';
  sourceType: 'playroom';
  sourceId: number;
}

// 내 그룹에 다이렉트 참여 요청
export interface GroupJoinRequestNotification extends NotificationBase {
  type: 'GROUP_JOIN_REQUEST';
  sourceType: 'group';
  sourceId: number;
}

// 내 플레이리스트로 그룹 생성 요청
export interface GroupCreateRequestNotification extends NotificationBase {
  type: 'GROUP_CREATE_REQUEST';
  sourceType: 'playlist';
  sourceId: number;
}

export type NotificationItem =
  | PlaylistCommentNotification
  | PlaylistLikeNotification
  | FollowNotification
  | FollowedLiveNotification
  | GroupJoinRequestNotification
  | GroupCreateRequestNotification;

export interface NotificationItemList {
  items: NotificationItem[];
  nextCursor: string | null;
}
