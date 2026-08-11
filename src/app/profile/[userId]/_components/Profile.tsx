'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import SyncLogo from '@/assets/icons/syncLogo.svg';
import Button from '@/components/Button';
import KebabModal from '@/components/domain/KebabModal';
import { Modal } from '@/components/Modal';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { logout } from '@/services/auth/auth.api';
import { withdraw } from '@/services/user/user.api';
import type { MyProfile, UserProfile } from '@/services/user/user.types';

import { useNotificationRequestQuery } from '../_hooks/useNotificationsQuery';
import NotificationItem from './NotificationItem';

type ProfileProps =
  { isOwn: true; profile: MyProfile } | { isOwn: false; profile: UserProfile };

export default function Profile(props: ProfileProps) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const { isOwn, profile } = props;

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  const { data, isPending, error } = useNotificationRequestQuery();

  const handleEditProfile = () => {
    router.push(`/profile/${profile.id}/edit`);
  };

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setLogoutError(
        error instanceof APIError
          ? error.message
          : '로그아웃에 실패했습니다. 다시 시도해주세요.',
      );
    }
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) return;

    setIsWithdrawing(true);
    setWithdrawError('');
    try {
      await withdraw();
      setUser(null);
      router.push('/');
      setIsWithdrawModalOpen(false);
    } catch (error) {
      console.error('회원 탈퇴 실패:', error);
      setWithdrawError(
        error instanceof APIError
          ? error.message
          : '회원 탈퇴에 실패했습니다. 다시 시도해주세요.',
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const stats = [
    ...(isOwn ? [{ label: '내 그룹', value: props.profile.groupCount }] : []),
    { label: '플레이리스트', value: profile.playlistCount },
    { label: '팔로우', value: profile.followerCount },
    { label: '팔로잉', value: profile.followingCount },
  ];

  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 py-6">
        <div className="flex flex-col gap-5">
          {isOwn ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex justify-end">
                <KebabModal>
                  <KebabModal.Item onClick={handleEditProfile}>
                    프로필 수정
                  </KebabModal.Item>
                  <KebabModal.Item onClick={handleLogout}>
                    로그아웃
                  </KebabModal.Item>
                  <KebabModal.Item
                    onClick={() => {
                      setWithdrawError('');
                      setIsWithdrawModalOpen(true);
                    }}
                    variant="danger"
                  >
                    회원 탈퇴
                  </KebabModal.Item>
                </KebabModal>
              </div>
              {logoutError ? (
                <p className="text-sm text-red-500">{logoutError}</p>
              ) : null}
            </div>
          ) : null}
          <Modal
            isOpen={isWithdrawModalOpen}
            onClose={() => {
              if (!isWithdrawing) {
                setIsWithdrawModalOpen(false);
              }
            }}
            closeOnBackdropClick={false}
          >
            <Modal.Header>회원 탈퇴</Modal.Header>

            <Modal.Body>
              <p className="text-text-secondary text-sm">
                탈퇴하면 계정 정보와 로그인 상태가 사라지며 되돌릴 수 없습니다.
                정말 탈퇴하시겠습니까?
              </p>
              {withdrawError ? (
                <p className="mt-2 text-sm text-red-500">{withdrawError}</p>
              ) : null}
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                size="md"
                variant="outline"
                isDisabled={isWithdrawing}
                onClick={() => {
                  setWithdrawError('');
                  setIsWithdrawModalOpen(false);
                }}
                className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
              >
                취소
              </Button>

              <Button
                type="button"
                size="md"
                variant="primary"
                isDisabled={isWithdrawing}
                onClick={handleWithdraw}
                className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full bg-red-500 px-0 font-bold hover:bg-red-600"
              >
                탈퇴하기
              </Button>
            </Modal.Footer>
          </Modal>

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
                className="bg-input flex size-16 shrink-0 items-center justify-center rounded-full"
                aria-hidden
              >
                <SyncLogo width={32} height={32} />
              </div>
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
              {data !== undefined &&
                [...data.items]
                  .sort((a, b) => Number(a.isRead) - Number(b.isRead))
                  .map((item) => (
                    <NotificationItem key={item.id} item={item} />
                  ))}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  );
}
