'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import KebabModal from '@/components/domain/KebabModal';
import Modal from '@/components/Modal';
import { APIError } from '@/lib/http/error';
import { deletePlaylist } from '@/services/playlist/playlist.api';

export default function PlaylistHeaderActions({
  playlistId,
  isOwner,
}: {
  playlistId: string | string[] | undefined;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleOpenDeleteModal = () => {
    setErrorMessage('');
    setIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setErrorMessage('');
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deletePlaylist(Number(playlistId));
      handleCloseDeleteModal();
      router.push('/playlist');
    } catch (error) {
      setErrorMessage(
        error instanceof APIError
          ? error.message
          : '플레이리스트를 삭제하는 중 오류가 발생했습니다.',
      );
    }
  };

  return (
    <>
      <div
        className={`bg-bg-card fixed top-25 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'} `}
      >
        링크가 복사되었습니다.
      </div>
      <div className="flex justify-between">
        <BackButton />
        <KebabModal>
          <>
            {isOwner ? (
              <>
                <KebabModal.Item onClick={handleShare}>
                  공유하기
                </KebabModal.Item>
                <KebabModal.Item
                  onClick={() => {
                    router.push(`/playlist/detail/${playlistId}/edit`);
                  }}
                >
                  수정하기
                </KebabModal.Item>
                <KebabModal.Item
                  onClick={handleOpenDeleteModal}
                  variant={'danger'}
                >
                  삭제하기
                </KebabModal.Item>
              </>
            ) : (
              <>
                <KebabModal.Item onClick={handleShare}>
                  공유하기
                </KebabModal.Item>
              </>
            )}
          </>
        </KebabModal>
      </div>
      <Modal isOpen={isOpen} onClose={handleCloseDeleteModal}>
        <div className="p-5">
          <Modal.Body>
            <h2
              id="login-required-modal-title"
              className="text-text-primary text-center text-lg font-bold"
            >
              {errorMessage ? errorMessage : '정말로 삭제하시겠습니까?'}
            </h2>
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="button"
              size="md"
              variant="outline"
              className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
              onClick={handleCloseDeleteModal}
            >
              취소
            </Button>
            <Button
              type="button"
              size="md"
              variant="primary"
              className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
}
