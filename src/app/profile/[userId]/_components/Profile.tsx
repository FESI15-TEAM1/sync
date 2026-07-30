'use client';

import { useRouter } from 'next/navigation';

import KebabModal from '@/components/domain/KebabModal';

type ProfileProps = {
  profileId: number;
  nickname: string;
  email: string;
  bio: string;
  groupCount: number;
  playlistCount: number;
  followerCount: number;
  followingCount: number;
};

type NotificationItem = {
  id: number;
  message: string;
  meta: string;
  isUnread?: boolean;
};

const MOCK_PROFILE: ProfileProps = {
  profileId: 1,
  nickname: 'JPOP 의 신',
  email: 'test@test.com',
  bio: '자기소개 입니다 웋히히',
  groupCount: 2,
  playlistCount: 14,
  followerCount: 10,
  followingCount: 50,
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    message: '도윤님이 "~" 플레이리스트 에 참여요청을 했습니다',
    meta: '게시글에서 참여 신청 · 3분 전',
    isUnread: true,
  },
  {
    id: 2,
    message: '서아님이 참여를 요청했어요',
    meta: '초대 링크로 참여 신청 · 1시간 전',
  },
  {
    id: 3,
    message: '예준님이 참여를 요청했어요',
    meta: '게시글에서 참여 신청 · 어제',
  },
];

export default function Profile({ profileId }: ProfileProps) {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push(`/profile/${profileId}/edit`);
  };

  const stats = [
    { label: '내 그룹', value: MOCK_PROFILE.groupCount },
    { label: '플레이리스트', value: MOCK_PROFILE.playlistCount },
    { label: '팔로우', value: MOCK_PROFILE.followerCount },
    { label: '팔로잉', value: MOCK_PROFILE.followingCount },
  ];

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <KebabModal>
            <KebabModal.Item onClick={handleEditProfile}>
              프로필 수정
            </KebabModal.Item>
          </KebabModal>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-input size-16 shrink-0 rounded-full" aria-hidden />
          <div className="min-w-0 flex-1">
            <h1 className="text-text-primary text-xl font-bold">
              {MOCK_PROFILE.nickname}
            </h1>
            <p className="text-text-secondary mt-1 text-sm">
              {MOCK_PROFILE.email}
            </p>
          </div>
        </div>

        <p className="text-text-secondary text-sm">{MOCK_PROFILE.bio}</p>

        <div className="flex justify-between">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-text-primary font-bold">{stat.value}</p>
              <p className="text-text-secondary mt-1 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-border flex flex-col gap-3 border-t pt-6">
        <h2 className="text-text-primary font-bold">알림</h2>

        <ul className="flex flex-col gap-3">
          {MOCK_NOTIFICATIONS.map((notification) => (
            <li
              key={notification.id}
              className="bg-bg-card relative flex items-start gap-3 overflow-hidden rounded-xl px-4 py-3"
            >
              <span
                aria-hidden
                className="bg-bg-primary absolute top-1/2 -left-1.5 size-3 -translate-y-1/2 rotate-45 rounded-xs"
              />
              <span
                aria-hidden
                className="bg-bg-primary absolute top-1/2 -right-1.5 size-3 -translate-y-1/2 rotate-45 rounded-xs"
              />

              <div
                className="bg-input size-10 shrink-0 rounded-full"
                aria-hidden
              />

              <div className="min-w-0 flex-1">
                <p className="text-text-primary text-sm leading-snug font-bold">
                  {notification.message}
                </p>
                <p className="text-text-secondary mt-1 text-xs">
                  {notification.meta}
                </p>
              </div>

              {notification.isUnread && (
                <span
                  aria-hidden
                  className="mt-1 size-2 shrink-0 rounded-full bg-green-500"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
