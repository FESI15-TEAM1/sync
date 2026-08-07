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

export interface GroupOwner {
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
  owner: GroupOwner;
  createdAt: string;
}
