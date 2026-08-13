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

// PATCH /groups/{groupId} — 보낸 필드만 반영, playlistIds는 별도 엔드포인트(PUT /groups/{groupId}/playlists)에서 처리
export interface UpdateGroupRequest {
  title?: string;
  description?: string;
  image?: string;
  isPublic?: boolean;
}

export interface GroupPlaylistOwner {
  userId: number;
  nickname: string;
  image: string | null;
}

// GET /groups/{groupId}/playlists, PUT /groups/{groupId}/playlists 응답 항목
export interface GroupPlaylistItem {
  id: number;
  title: string;
  image?: string;
  trackCount: number;
  isHighlighted: boolean;
  owner: GroupPlaylistOwner;
}

export interface GetGroupPlaylistsParams {
  cursor?: string;
  limit?: number;
}

export interface GetGroupPlaylistsResponse {
  items: GroupPlaylistItem[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}

// PUT /groups/{groupId}/playlists — 배열은 이 스코프의 최종 상태(참여자=내 것 / 그룹장=그룹 전체)
export interface EditGroupPlaylistsRequest {
  playlistIds: number[];
}

export interface GetGroupsParams {
  // 이전 응답의 nextCursor. 첫 페이지는 생략합니다.
  cursor?: string;
  // 한 페이지 개수(1~50). 생략하면 백엔드 기본값 20이고, 범위를 벗어나면 백엔드가 자동 보정합니다.
  limit?: number;
}

export interface GroupOwnerSummary {
  userId: number;
  nickname: string;
  image: string | null;
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

// GET /groups/{groupId} — 그룹 상세 조회

export interface GroupDetailResponse {
  id: number;
  title: string;
  description: string;
  image: string | null;
  isPublic: boolean;
  isMember: boolean;
  inviteCode: string | null;
  memberCount: number;
  playlistCount: number;
  owner: GroupOwnerSummary;
  createdAt: string;
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

export interface GroupPlaylistResponse {
  id: number;
  title: string;
  image?: string;
  trackCount: number;
  isHighlighted: boolean;
  // 플레이리스트 소유자(= 그룹에 담은 사람)
  owner: PublicGroupOwner;
}

export interface GetGroupPlaylistsParams {
  cursor?: string;
  limit?: number;
}

export interface GetGroupPlaylistsResponse {
  items: GroupPlaylistResponse[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}

export interface EditGroupPlaylistsRequest {
  // 이 스코프의 최종 플레이리스트 id 목록(참여자=내 것 / 그룹장=그룹 전체). 빈 배열 허용
  playlistIds: number[];
}

// GET /groups/{groupId}/members — 그룹 멤버 목록(가입 순)
export interface GroupMemberResponse {
  userId: number;
  // 탈퇴한 유저는 "탈퇴한 사용자"
  nickname: string;
  image: string | null;
  isOwner: boolean;
}

export interface GetGroupMembersParams {
  cursor?: string;
  limit?: number;
}

export interface GetGroupMembersResponse {
  items: GroupMemberResponse[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}

export type EditGroupPlaylistsResponse = GroupPlaylistResponse[];

export type GroupRequestStatus = 'pending' | 'accepted' | 'rejected';

// POST /group-requests — 공개 그룹 참여 요청(승인제, sourceType=group)
export interface CreateGroupJoinRequestPayload {
  sourceType: 'group';
  sourceId: number;
}
export interface CreatePlaylistJoinRequestPayload {
  sourceType: 'playlist';
  sourceId: number;
}

export interface CreateGroupRequestPayload {
  sourceType: 'group' | 'playlist';
  sourceId: number;
}
export interface GroupRequestResponse {
  id: number;
  sourceType: 'group' | 'playlist';
  sourceId: number;
  status: GroupRequestStatus;
  requester: GroupOwnerSummary;
  createdAt: string;
}
