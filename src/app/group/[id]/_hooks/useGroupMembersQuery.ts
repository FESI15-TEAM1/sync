import { useQuery } from '@tanstack/react-query';

import { getGroupMembers } from '@/services/group/group.api';

import { groupQueryKey } from './useGroupQuery';

const GROUP_MEMBERS_LIMIT = 50;

export const groupMembersQueryKey = (groupId: number | string) =>
  [...groupQueryKey(groupId), 'members'] as const;

export function useGroupMembersQuery(groupId: number) {
  return useQuery({
    queryKey: groupMembersQueryKey(groupId),
    queryFn: () => getGroupMembers(groupId, { limit: GROUP_MEMBERS_LIMIT }),
  });
}
