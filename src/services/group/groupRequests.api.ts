import { clientFetch } from '@/lib/http/client-fetch';

import type {
  GetGroupRequestsParams,
  GetGroupRequestsResponse,
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
