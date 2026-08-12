'use client';

import Image from 'next/image';

import SyncLogo from '@/assets/icons/syncLogo.svg';
import Modal from '@/components/Modal';
import { useUserQuery } from '@/hooks/useUserQuery';
import { APIError } from '@/lib/http/error';

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
  const {
    data: user,
    isPending,
    isError,
    error,
  } = useUserQuery(userId ?? 0, isOpen && userId !== null);

  const errorMessage = isError
    ? error instanceof APIError
      ? error.message
      : '프로필 정보를 가져오지 못했습니다.'
    : null;

  const stats = user
    ? [
        { label: '플레이리스트', value: user.playlistCount },
        { label: '팔로우', value: user.followerCount },
        { label: '팔로잉', value: user.followingCount },
      ]
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
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
              <div className="mt-2 flex flex-row gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span>{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
