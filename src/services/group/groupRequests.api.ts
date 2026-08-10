import { clientFetch } from '@/lib/http/client-fetch';
import type { GroupRequestResponse } from '@/services/group/group.types';

import type {
  GetGroupRequestsParams,
  GetGroupRequestsResponse,
  ProcessGroupRequestPayload,
} from './groupRequests.type';

export function getGroupRequests({
  cursor,
  limit,
}: GetGroupRequestsParams = {}) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetGroupRequestsResponse>('/group-requests', {
    method: 'GET',
    params: Object.keys(params).length > 0 ? params : undefined,
  });
}

// 그룹 합류 요청 수락/거절
export function processGroupRequest(
  requestId: number,
  payload: ProcessGroupRequestPayload,
) {
  return clientFetch<GroupRequestResponse>(`/group-requests/${requestId}`, {
    method: 'PATCH',
    body: payload,
  });
}
