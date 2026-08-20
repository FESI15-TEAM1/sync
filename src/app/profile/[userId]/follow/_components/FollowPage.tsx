'use client';

import { useState } from 'react';

import ProfilePreviewModal from '@/components/domain/user/ProfilePreviewModal';
import { APIError } from '@/lib/http/error';

import {
  useFollowersQuery,
  useFollowingQuery,
  useToggleFollowMutation,
} from '../_hooks/useFollowQuery';
import FollowerList from './FollowerList';
import FollowingList from './FollowingList';

type FollowTab = 'followers' | 'following';

type Props = {
  userId: number;
  initialTab?: FollowTab;
};

export default function FollowPage({
  userId,
  initialTab = 'followers',
}: Props) {
  const [activeTab, setActiveTab] = useState<FollowTab>(initialTab);
  const [previewUserId, setPreviewUserId] = useState<number | null>(null);

  const followersQuery = useFollowersQuery(userId);
  const followingQuery = useFollowingQuery(userId);
  const toggleFollowMutation = useToggleFollowMutation(userId);

  const followers = followersQuery.data ?? [];
  const following = followingQuery.data ?? [];

  const activeQuery =
    activeTab === 'followers' ? followersQuery : followingQuery;

  const errorMessage = toggleFollowMutation.isError
    ? toggleFollowMutation.error instanceof APIError
      ? toggleFollowMutation.error.message
      : '팔로우 상태를 변경하지 못했습니다.'
    : activeQuery.isError
      ? activeQuery.error instanceof APIError
        ? activeQuery.error.message
        : '팔로우 목록을 불러오지 못했습니다.'
      : '';

  const pendingTargetId = toggleFollowMutation.isPending
    ? toggleFollowMutation.variables.targetId
    : null;

  const handleToggleFollow = (targetId: number) => {
    // 같은 대상에 대한 요청이 아직 진행 중이면 중복 토글(POST/DELETE 경합)을 막습니다.
    if (pendingTargetId === targetId) return;

    const list = activeTab === 'followers' ? followers : following;
    const target = list.find((user) => user.id === targetId);
    if (!target) return;

    toggleFollowMutation.mutate({
      targetId,
      nextIsFollowing: !target.isFollowing,
    });
  };

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

      {errorMessage ? (
        <p className="mt-4 text-center text-sm text-red-500">{errorMessage}</p>
      ) : null}

      <div className="mt-4">
        {activeQuery.isPending ? (
          <p className="text-text-secondary py-10 text-center text-sm">
            불러오는 중...
          </p>
        ) : activeTab === 'followers' ? (
          <FollowerList
            users={followers}
            onToggleFollow={handleToggleFollow}
            onUserClick={setPreviewUserId}
            pendingUserId={pendingTargetId}
          />
        ) : (
          <FollowingList
            users={following}
            onToggleFollow={handleToggleFollow}
            onUserClick={setPreviewUserId}
            pendingUserId={pendingTargetId}
          />
        )}
      </div>

      <ProfilePreviewModal
        userId={previewUserId}
        isOpen={previewUserId !== null}
        onClose={() => setPreviewUserId(null)}
      />

      {!activeQuery.isPending && activeQuery.hasNextPage ? (
        <button
          type="button"
          onClick={() => activeQuery.fetchNextPage()}
          disabled={activeQuery.isFetchingNextPage}
          className="text-text-secondary mt-4 self-center text-sm disabled:opacity-50"
        >
          {activeQuery.isFetchingNextPage ? '불러오는 중...' : '더 보기'}
        </button>
      ) : null}
    </div>
  );
}
