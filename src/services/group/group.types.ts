export interface CreateGroupRequest {
  title: string;
  description: string;
  image?: string;
  isPublic: boolean;
  playlistIds: number[];
}

export interface CreateGroupResponse {
  id: number;
  inviteCode: string;
}

export interface GetGroupsParams {
  // 이전 응답의 nextCursor. 첫 페이지는 생략합니다.
  cursor?: string;
  // 한 페이지 개수(1~50). 생략하면 백엔드 기본값 20이고, 범위를 벗어나면 백엔드가 자동 보정합니다.
  limit?: number;
}

export interface GroupSummary {
  id: number;
  title: string;
  image?: string;
  memberCount: number;
  playlistCount: number;
}

export interface GetGroupsResponse {
  items: GroupSummary[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}

export interface PublicGroupOwner {
  userId: number;
  nickname: string;
  image: string | null;
}

export interface PublicGroup {
  id: number;
  title: string;
  description: string;
  image?: string;
  memberCount: number;
  playlistCount: number;
  owner: PublicGroupOwner;
  isMember: boolean;
  createdAt: string;
}

export interface GetPublicGroupsParams {
  cursor?: string;
  limit?: number;
}

export interface GetPublicGroupsResponse {
  items: PublicGroup[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}
