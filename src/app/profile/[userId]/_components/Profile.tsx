'use client';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import SyncLogo from '@/assets/icons/syncLogo.svg';
import Button from '@/components/Button';
import KebabModal from '@/components/domain/KebabModal';
import { Modal } from '@/components/Modal';
import { useToggleFollowMutation } from '@/hooks/useToggleFollowMutation';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { logout } from '@/services/auth/auth.api';
import { withdraw } from '@/services/user/user.api';
import type { MyProfile, UserProfile } from '@/services/user/user.types';

import NotificationItem from '../../../../components/NotificationItem';
import {
  useMarkNotificationReadAll,
  useNotificationRequestQuery,
} from '../_hooks/useNotificationsQuery';

type ProfileProps =
  { isOwn: true; profile: MyProfile } | { isOwn: false; profile: UserProfile };

export default function Profile(props: ProfileProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  const { isOwn, profile } = props;

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [isFollowing, setIsFollowing] = useState(!isOwn && profile.isFollowing);
  const [followerCount, setFollowerCount] = useState(profile.followerCount);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useNotificationRequestQuery(profile.id, isOwn);
  const { mutate: notificationReadAll } = useMarkNotificationReadAll(
    profile.id,
  );
  const { mutate: toggleFollow, isPending: isTogglingFollow } =
    useToggleFollowMutation();

  const notificationItems = data?.pages.flatMap((page) => page.items) ?? [];

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOwn || !hasNextPage) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [isOwn, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleEditProfile = () => {
    router.push(`/profile/${profile.id}/edit`);
  };

  const handleToggleFollow = () => {
    if (isOwn) return;

    const nextIsFollowing = !isFollowing;
    setIsFollowing(nextIsFollowing);
    setFollowerCount((count) => count + (nextIsFollowing ? 1 : -1));

    toggleFollow(
      { userId: profile.id, nextIsFollowing },
      {
        onError: () => {
          setIsFollowing(!nextIsFollowing);
          setFollowerCount((count) => count + (nextIsFollowing ? -1 : 1));
        },
      },
    );
  };

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await logout();
      setUser(null);
      // 계정에 묶인 캐시(내 프로필·내 플레이룸 등)가 다음 계정으로 새지 않도록 전부 비웁니다.
      queryClient.clear();
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
      // 탈퇴한 계정의 캐시가 남지 않도록 전부 비웁니다.
      queryClient.clear();
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
            {isOwn ? (
              <Link href="/group" className="text-center">
                <p className="text-text-primary font-bold">
                  {props.profile.groupCount}
                </p>
                <p className="text-text-secondary mt-1 text-xs">내 그룹</p>
              </Link>
            ) : null}
            <Link href={`/playlist/${profile.id}`} className="text-center">
              <p className="text-text-primary font-bold">
                {profile.playlistCount}
              </p>
              <p className="text-text-secondary mt-1 text-xs">플레이리스트</p>
            </Link>
            <Link
              href={`/profile/${profile.id}/follow`}
              className="text-center"
            >
              <p className="text-text-primary font-bold">{followerCount}</p>
              <p className="text-text-secondary mt-1 text-xs">팔로우</p>
            </Link>
            <Link
              href={`/profile/${profile.id}/follow?tab=following`}
              className="text-center"
            >
              <p className="text-text-primary font-bold">
                {profile.followingCount}
              </p>
              <p className="text-text-secondary mt-1 text-xs">팔로잉</p>
            </Link>
          </div>

          {isOwn ? null : (
            <Button
              type="button"
              size="md"
              variant={isFollowing ? 'outline' : 'primary'}
              isDisabled={isTogglingFollow}
              onClick={handleToggleFollow}
              className="w-full rounded-full font-bold"
            >
              {isFollowing ? '언팔로우' : '팔로우'}
            </Button>
          )}
        </div>

        {isOwn ? (
          <div className="border-border flex flex-col gap-3 border-t pt-6">
            <div className="flex justify-between">
              <h2 className="text-text-primary font-bold">알림</h2>
              <button
                className="text-text-secondary hover:text-text-primary cursor-pointer text-sm font-bold transition-all"
                onClick={() => notificationReadAll()}
              >
                모두 읽기
              </button>
            </div>
            <ul className="bg-bg-card divide-border flex flex-col divide-y overflow-hidden rounded-xl">
              {[...notificationItems]
                .sort((a, b) => Number(a.isRead) - Number(b.isRead))
                .map((item) => (
                  <NotificationItem
                    key={item.id}
                    item={item}
                    userId={profile.id}
                  />
                ))}
            </ul>
            {hasNextPage ? <div ref={loadMoreRef} className="h-1" /> : null}
            {isFetchingNextPage ? (
              <p className="text-text-secondary text-center text-sm">
                불러오는 중...
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
