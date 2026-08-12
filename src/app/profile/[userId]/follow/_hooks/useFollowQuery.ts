'use client';

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from '@/services/follow/follow.api';
import type { FollowListResponse } from '@/services/follow/follow.types';

const FOLLOW_PAGE_SIZE = 20;

export const followersQueryKey = (userId: number) =>
  ['users', userId, 'followers'] as const;
export const followingQueryKey = (userId: number) =>
  ['users', userId, 'following'] as const;

export function useFollowersQuery(userId: number) {
  return useInfiniteQuery({
    queryKey: followersQueryKey(userId),
    queryFn: ({ pageParam }) =>
      getFollowers(userId, { cursor: pageParam, limit: FOLLOW_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    // nextCursor가 null이면 마지막 페이지입니다.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

export function useFollowingQuery(userId: number) {
  return useInfiniteQuery({
    queryKey: followingQueryKey(userId),
    queryFn: ({ pageParam }) =>
      getFollowing(userId, { cursor: pageParam, limit: FOLLOW_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

function withUpdatedFollowState(
  data: InfiniteData<FollowListResponse> | undefined,
  targetId: number,
  isFollowing: boolean,
) {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.userId === targetId ? { ...item, isFollowing } : item,
      ),
    })),
  };
}

// 같은 유저가 팔로워/팔로잉 목록 양쪽에 모두 나타날 수 있어 두 캐시를 함께 갱신합니다.
export function useToggleFollowMutation(profileUserId: number) {
  const queryClient = useQueryClient();
  const followersKey = followersQueryKey(profileUserId);
  const followingKey = followingQueryKey(profileUserId);

  return useMutation({
    mutationFn: ({
      targetId,
      nextIsFollowing,
    }: {
      targetId: number;
      nextIsFollowing: boolean;
    }) => (nextIsFollowing ? followUser(targetId) : unfollowUser(targetId)),

    onMutate: async ({ targetId, nextIsFollowing }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: followersKey }),
        queryClient.cancelQueries({ queryKey: followingKey }),
      ]);

      const previousFollowers =
        queryClient.getQueryData<InfiniteData<FollowListResponse>>(
          followersKey,
        );
      const previousFollowing =
        queryClient.getQueryData<InfiniteData<FollowListResponse>>(
          followingKey,
        );

      queryClient.setQueryData<InfiniteData<FollowListResponse>>(
        followersKey,
        (old) => withUpdatedFollowState(old, targetId, nextIsFollowing),
      );
      queryClient.setQueryData<InfiniteData<FollowListResponse>>(
        followingKey,
        (old) => withUpdatedFollowState(old, targetId, nextIsFollowing),
      );

      return { previousFollowers, previousFollowing };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousFollowers !== undefined) {
        queryClient.setQueryData(followersKey, context.previousFollowers);
      }
      if (context?.previousFollowing !== undefined) {
        queryClient.setQueryData(followingKey, context.previousFollowing);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: followersKey });
      queryClient.invalidateQueries({ queryKey: followingKey });
    },
  });
}
