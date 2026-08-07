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

export interface GroupOwnerSummary {
  userId: number;
  nickname: string;
  image: string | null;
}

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
