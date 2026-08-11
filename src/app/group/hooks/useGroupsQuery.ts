import { useQuery } from '@tanstack/react-query';

import { getGroups } from '@/services/group/group.api';
import type { GetGroupsParams } from '@/services/group/group.types';

export const groupsQueryKey = (params: GetGroupsParams = {}) =>
  ['groups', params] as const;

export function useGroupsQuery(params: GetGroupsParams = {}) {
  return useQuery({
    queryKey: groupsQueryKey(params),
    queryFn: () => getGroups(params),
  });
}
