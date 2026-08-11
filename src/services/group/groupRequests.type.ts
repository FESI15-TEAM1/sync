import type { GroupRequestResponse } from '@/services/group/group.types';

export interface GetGroupRequestsParams {
  cursor?: string;
  limit?: number;
}

// GET /group-requests
export interface GetGroupRequestsResponse {
  items: GroupRequestResponse[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}

// PATCH /group-requests/{requestId} — 요청 수락/거절
export interface ProcessGroupRequestPayload {
  status: 'accepted' | 'rejected';
  // playlist 타입 수락 시 필수(내가 그룹장이고 해당 플레이리스트를 담은 그룹). group 타입/거절 시엔 불필요.
  targetGroupId?: number;
}
