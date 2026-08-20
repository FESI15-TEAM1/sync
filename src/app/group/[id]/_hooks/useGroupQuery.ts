import { useQuery } from '@tanstack/react-query';

import { getGroup } from '@/services/group/group.api';

export const groupQueryKey = (groupId: number | string) =>
  ['group', Number(groupId)] as const;

// 그룹 상세 조회(편집 화면 등 클라이언트에서 직접 필요한 경우)
export function useGroupQuery(groupId: number | string) {
  return useQuery({
    queryKey: groupQueryKey(groupId),
    queryFn: () => getGroup(groupId),
  });
}
