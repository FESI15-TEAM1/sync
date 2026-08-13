'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import SyncLogo from '@/assets/icons/syncLogo.svg';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { useToggleFollowMutation } from '@/hooks/useToggleFollowMutation';
import { useUserQuery } from '@/hooks/useUserQuery';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';

type ProfilePreviewModalProps = {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProfilePreviewModal({
  userId,
  isOpen,
  onClose,
}: ProfilePreviewModalProps) {
  const router = useRouter();
  const myId = useUserStore((state) => state.user?.id);
  const {
    data: user,
    isPending,
    isError,
    error,
  } = useUserQuery(userId ?? 0, isOpen && userId !== null);
  const { mutate: toggleFollow, isPending: isTogglingFollow } =
    useToggleFollowMutation();

  const handleToggleFollow = () => {
    if (!user || userId === null) return;

    toggleFollow({ userId, nextIsFollowing: !user.isFollowing });
  };

  const handleGoToProfile = () => {
    if (userId === null) return;

    onClose();
    router.push(`/profile/${userId}`);
  };

  const errorMessage = isError
    ? error instanceof APIError
      ? error.message
      : '프로필 정보를 가져오지 못했습니다.'
    : null;

  const stats = user
    ? [
        { label: '플레이 리스트', value: user.playlistCount },
        { label: '팔로우', value: user.followerCount },
        { label: '팔로잉', value: user.followingCount },
      ]
    : [];

  return (
    <Modal
      ariaLabelledBy="profile-preview-title"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Modal.Body>
        <h2 id="profile-preview-title" className="sr-only"></h2>
        <div className="flex flex-col items-center text-white">
          {errorMessage ? (
            <p className="py-10 text-sm text-red-500">{errorMessage}</p>
          ) : isPending || !user ? (
            <p className="py-10 text-sm">불러오는 중...</p>
          ) : (
            <>
              {user.image ? (
                <Image
                  className="rounded-full"
                  src={user.image}
                  width={200}
                  height={200}
                  alt={`${user.nickname} 프로필`}
                />
              ) : (
                <div
                  className="bg-input flex size-50 items-center justify-center rounded-full"
                  aria-hidden
                >
                  <SyncLogo width={100} height={100} />
                </div>
              )}
              <p className="mt-2 mb-2">{user.nickname}</p>
              {user.description ? <p>{user.description}</p> : null}
              <div className="mt-2 mb-5 flex flex-row justify-center gap-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative flex w-28 flex-col items-center text-center"
                  >
                    <span>{stat.value}</span>
                    <span className="absolute inset-x-0 top-full text-sm tracking-wide whitespace-nowrap">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal.Body>
      {user ? (
        <Modal.Footer>
          {userId !== myId ? (
            <Button
              type="button"
              variant={user.isFollowing ? 'outline' : 'primary'}
              isDisabled={isTogglingFollow}
              onClick={handleToggleFollow}
            >
              {user.isFollowing ? '언팔로우' : '팔로우'}
            </Button>
          ) : null}
          <Button type="button" variant="primary" onClick={handleGoToProfile}>
            프로필
          </Button>
        </Modal.Footer>
      ) : null}
    </Modal>
  );
}
