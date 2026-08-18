import { useQuery } from '@tanstack/react-query';

import { getGroupMembers } from '@/services/group/group.api';

const GROUP_MEMBERS_LIMIT = 50;

export function useGroupMembersQuery(groupId: number) {
  return useQuery({
    queryKey: ['group', groupId, 'members'],
    queryFn: () => getGroupMembers(groupId, { limit: GROUP_MEMBERS_LIMIT }),
  });
}
