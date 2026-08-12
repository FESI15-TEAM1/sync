import { useQuery } from '@tanstack/react-query';

import { getUser } from '@/services/user/user.api';

export const userQueryKey = (userId: number) => ['users', userId] as const;

export function useUserQuery(userId: number, enabled = true) {
  return useQuery({
    queryKey: userQueryKey(userId),
    queryFn: () => getUser(userId),
    enabled,
  });
}
