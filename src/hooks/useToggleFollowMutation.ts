import { useMutation, useQueryClient } from '@tanstack/react-query';

import { followUser, unfollowUser } from '@/services/follow/follow.api';

import { userQueryKey } from './useUserQuery';

export function useToggleFollowMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      nextIsFollowing,
    }: {
      userId: number;
      nextIsFollowing: boolean;
    }) => (nextIsFollowing ? followUser(userId) : unfollowUser(userId)),

    onSuccess: (_data, { userId }) => {
      return queryClient.invalidateQueries({ queryKey: userQueryKey(userId) });
    },
  });
}
