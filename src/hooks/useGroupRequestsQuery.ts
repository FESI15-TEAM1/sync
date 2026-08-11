import { useQuery } from '@tanstack/react-query';

import { getGroupRequests } from '@/services/group/groupRequests.api';
import type { GetGroupRequestsParams } from '@/services/group/groupRequests.type';

export const groupRequestsQueryKey = (params: GetGroupRequestsParams = {}) =>
  ['group-requests', params] as const;

export function useGroupRequestsQuery(params: GetGroupRequestsParams = {}) {
  return useQuery({
    queryKey: groupRequestsQueryKey(params),
    queryFn: () => getGroupRequests(params),
  });
}
