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
