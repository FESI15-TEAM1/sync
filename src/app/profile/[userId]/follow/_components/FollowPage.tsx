'use client';

import { useState } from 'react';

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

const MOCK_FOLLOWERS: FollowUser[] = [
  {
    id: 1,
    nickname: 'KPOP의 신',
    isFollowing: true,
  },
  {
    id: 2,
    nickname: '나는 문어 꿈을꾸는 문어',
    isFollowing: true,
  },
  {
    id: 3,
    nickname: '개발하면서 듣기',
    isFollowing: true,
  },
  {
    id: 4,
    nickname: '테크노의 신',
    isFollowing: true,
  },
  {
    id: 5,
    nickname: '감다살디제잉',
    isFollowing: true,
  },
];

const MOCK_FOLLOWING: FollowUser[] = [
  {
    id: 11,
    nickname: '새벽감성',
    isFollowing: true,
  },
  {
    id: 12,
    nickname: '재즈라운지',
    isFollowing: true,
  },
  {
    id: 13,
    nickname: '코딩할때',
    isFollowing: true,
  },
  {
    id: 14,
    nickname: '인디플리',
    isFollowing: true,
  },
];

export default function FollowPage({ userId }: Props) {
  const [activeTab, setActiveTab] = useState<FollowTab>('followers');
  const [followers, setFollowers] = useState(MOCK_FOLLOWERS);
  const [following, setFollowing] = useState(MOCK_FOLLOWING);

  const handleToggleFollow = (targetId: number) => {
    const updateList = (list: FollowUser[]) =>
      list.map((user) =>
        user.id === targetId
          ? { ...user, isFollowing: !user.isFollowing }
          : user,
      );

    if (activeTab === 'followers') {
      setFollowers(updateList);
    } else {
      setFollowing(updateList);
    }
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

      <div className="mt-4">
        {activeTab === 'followers' ? (
          <FollowerList users={followers} onToggleFollow={handleToggleFollow} />
        ) : (
          <FollowingList
            users={following}
            onToggleFollow={handleToggleFollow}
          />
        )}
      </div>
    </div>
  );
}
