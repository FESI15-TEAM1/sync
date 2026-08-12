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

// 팔로워 목록 조회
export function getFollowers(
  userId: number,
  { cursor, limit }: GetFollowListParams = {},
) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<FollowListResponse>(`/users/${userId}/followers`, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
}

// 팔로잉 목록 조회
export function getFollowing(
  userId: number,
  { cursor, limit }: GetFollowListParams = {},
) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<FollowListResponse>(`/users/${userId}/following`, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
}
