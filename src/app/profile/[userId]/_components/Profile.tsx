'use client';

import { useRouter } from 'next/navigation';

import KebabModal from '@/components/domain/KebabModal';
import { useUserStore } from '@/providers/user-store-provider';
import { logout } from '@/services/auth/auth.api';
import type { MyProfile, UserProfile } from '@/services/user/user.types';

type ProfileProps =
  { isOwn: true; profile: MyProfile } | { isOwn: false; profile: UserProfile };

type NotificationItem = {
  id: number;
  message: string;
  meta: string;
  isUnread?: boolean;
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

export default function Profile(props: ProfileProps) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const { isOwn, profile } = props;

  const handleEditProfile = () => {
    router.push(`/profile/${profile.id}/edit`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // TODO: 회원 탈퇴 API 연동
  const handleWithdraw = () => {
    console.log('회원탈퇴 계정', profile.id);
  };

  const stats = [
    ...(isOwn ? [{ label: '내 그룹', value: props.profile.groupCount }] : []),
    { label: '플레이리스트', value: profile.playlistCount },
    { label: '팔로우', value: profile.followerCount },
    { label: '팔로잉', value: profile.followingCount },
  ];

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6">
      <div className="flex flex-col gap-5">
        {isOwn ? (
          <div className="flex justify-end">
            <KebabModal>
              <KebabModal.Item onClick={handleEditProfile}>
                프로필 수정
              </KebabModal.Item>
            </KebabModal>
            <KebabModal>
              <KebabModal.Item onClick={handleLogout}>로그아웃</KebabModal.Item>
            </KebabModal>
            <KebabModal>
              <KebabModal.Item onClick={handleWithdraw} variant="danger">
                회원 탈퇴
              </KebabModal.Item>
            </KebabModal>
          </div>
        ) : null}

        <div className="flex items-center gap-4">
          {profile.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- 유저 업로드 CDN 호스트가 가변
            <img
              src={profile.image}
              alt={`${profile.nickname} 프로필`}
              width={64}
              height={64}
              className="size-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              className="bg-input size-16 shrink-0 rounded-full"
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-text-primary text-xl font-bold">
              {profile.nickname}
            </h1>
            {isOwn ? (
              <p className="text-text-secondary mt-1 text-sm">
                {props.profile.email}
              </p>
            ) : null}
          </div>
        </div>

        {profile.description ? (
          <p className="text-text-secondary text-sm">{profile.description}</p>
        ) : null}

        <div className="flex justify-between">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-text-primary font-bold">{stat.value}</p>
              <p className="text-text-secondary mt-1 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {isOwn ? (
        <div className="border-border flex flex-col gap-3 border-t pt-6">
          <h2 className="text-text-primary font-bold">알림</h2>

          <ul className="bg-bg-card divide-border flex flex-col divide-y overflow-hidden rounded-xl">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <li
                key={notification.id}
                className="flex items-start gap-3 px-4 py-3"
              >
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
      ) : null}
    </div>
  );
}
