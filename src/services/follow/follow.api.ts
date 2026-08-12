import { clientFetch } from '@/lib/http/client-fetch';

import type { FollowListResponse, GetFollowListParams } from './follow.types';

// 유저 팔로우 (멱등)
export function followUser(userId: number) {
  return clientFetch<null>(`/users/${userId}/follow`, { method: 'POST' });
}

// 유저 언팔로우 (멱등)
export function unfollowUser(userId: number) {
  return clientFetch<null>(`/users/${userId}/follow`, { method: 'DELETE' });
}

function toFollowListParams({ cursor, limit }: GetFollowListParams = {}) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return Object.keys(params).length > 0 ? params : undefined;
}

// 팔로워/팔로잉 목록 조회
export function getFollowList(
  userId: number,
  type: 'followers' | 'following',
  params: GetFollowListParams = {},
) {
  return clientFetch<FollowListResponse>(`/users/${userId}/${type}`, {
    params: toFollowListParams(params),
  });
}
