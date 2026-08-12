'use client';

import { useCallback, useEffect, useState } from 'react';

import { APIError } from '@/lib/http/error';
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from '@/services/follow/follow.api';
import type { FollowUserResponse } from '@/services/follow/follow.types';

import FollowerList from './FollowerList';
import FollowingList from './FollowingList';

export type FollowUser = {
  id: number;
  nickname: string;
  image?: string | null;
  isFollowing: boolean;
};

type FollowTab = 'followers' | 'following';

type Props = {
  userId: number;
};

function toFollowUser(item: FollowUserResponse): FollowUser {
  return {
    id: item.userId,
    nickname: item.nickname,
    image: item.image,
    isFollowing: item.isFollowing,
  };
}

export default function FollowPage({ userId }: Props) {
  const [activeTab, setActiveTab] = useState<FollowTab>('followers');
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followersCursor, setFollowersCursor] = useState<string | null>(null);
  const [followingCursor, setFollowingCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadLists() {
      setIsLoading(true);
      setError('');
      try {
        const [followersRes, followingRes] = await Promise.all([
          getFollowers(userId),
          getFollowing(userId),
        ]);

        if (!isMounted) return;

        setFollowers(followersRes.items.map(toFollowUser));
        setFollowersCursor(followersRes.nextCursor);
        setFollowing(followingRes.items.map(toFollowUser));
        setFollowingCursor(followingRes.nextCursor);
      } catch (err) {
        if (!isMounted) return;
        console.error('팔로우 목록 조회 실패:', err);
        setError(
          err instanceof APIError
            ? err.message
            : '팔로우 목록을 불러오지 못했습니다.',
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadLists();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleLoadMore = useCallback(async () => {
    const cursor = activeTab === 'followers' ? followersCursor : followingCursor;
    if (!cursor) return;

    try {
      if (activeTab === 'followers') {
        const res = await getFollowers(userId, { cursor });
        setFollowers((prev) => [...prev, ...res.items.map(toFollowUser)]);
        setFollowersCursor(res.nextCursor);
      } else {
        const res = await getFollowing(userId, { cursor });
        setFollowing((prev) => [...prev, ...res.items.map(toFollowUser)]);
        setFollowingCursor(res.nextCursor);
      }
    } catch (err) {
      console.error('팔로우 목록 추가 조회 실패:', err);
      setError(
        err instanceof APIError
          ? err.message
          : '팔로우 목록을 불러오지 못했습니다.',
      );
    }
  }, [activeTab, followersCursor, followingCursor, userId]);

  const handleToggleFollow = async (targetId: number) => {
    const list = activeTab === 'followers' ? followers : following;
    const target = list.find((user) => user.id === targetId);
    if (!target) return;

    const nextIsFollowing = !target.isFollowing;
    const updateList = (users: FollowUser[]) =>
      users.map((user) =>
        user.id === targetId
          ? { ...user, isFollowing: nextIsFollowing }
          : user,
      );

    setFollowers(updateList);
    setFollowing(updateList);

    try {
      if (nextIsFollowing) {
        await followUser(targetId);
      } else {
        await unfollowUser(targetId);
      }
    } catch (err) {
      console.error('팔로우 상태 변경 실패:', err);
      const revertList = (users: FollowUser[]) =>
        users.map((user) =>
          user.id === targetId
            ? { ...user, isFollowing: target.isFollowing }
            : user,
        );

      setFollowers(revertList);
      setFollowing(revertList);
      setError(
        err instanceof APIError
          ? err.message
          : '팔로우 상태를 변경하지 못했습니다.',
      );
    }
  };

  const activeCursor =
    activeTab === 'followers' ? followersCursor : followingCursor;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-6">
      <div role="tablist" className="flex items-center justify-center">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'followers'}
          onClick={() => setActiveTab('followers')}
          className={
            activeTab === 'followers'
              ? 'text-text-primary text-md font-bold'
              : 'text-text-secondary text-md'
          }
        >
          {followers.length} 팔로우
        </button>
        <span aria-hidden="true" className="bg-border mx-4 block h-4 w-px" />
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'following'}
          onClick={() => setActiveTab('following')}
          className={
            activeTab === 'following'
              ? 'text-text-primary text-md font-bold'
              : 'text-text-secondary text-md'
          }
        >
          {following.length} 팔로잉
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-center text-sm text-red-500">{error}</p>
      ) : null}

      <div className="mt-4">
        {isLoading ? (
          <p className="text-text-secondary py-10 text-center text-sm">
            불러오는 중...
          </p>
        ) : activeTab === 'followers' ? (
          <FollowerList users={followers} onToggleFollow={handleToggleFollow} />
        ) : (
          <FollowingList
            users={following}
            onToggleFollow={handleToggleFollow}
          />
        )}
      </div>

      {!isLoading && activeCursor ? (
        <button
          type="button"
          onClick={handleLoadMore}
          className="text-text-secondary mt-4 self-center text-sm"
        >
          더 보기
        </button>
      ) : null}
    </div>
  );
}
