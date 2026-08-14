'use client';

import { useState } from 'react';

import BackButton from '@/components/common/BackButton';
import KebabModal from '@/components/domain/KebabModal';

import { useDeletePlayroom } from '../_hooks/useDeletePlayroom';
import PlayroomCloseModal from './Modal/PlayroomCloseModal';
import PlayroomEditModal from './Modal/PlayroomEditModal';

export default function PlayroomHeader({
  playroomId,
  playroomTitle,
  playroomDescription,
  isHost,
  onBeforeBack,
}: {
  playroomId: number;
  playroomTitle: string;
  playroomDescription: string;
  isHost: boolean;
  /** 뒤로가기 직전에 호출됩니다. `false` 를 반환하면 이동하지 않습니다. */
  onBeforeBack?: () => boolean;
}) {
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { closePlayroom, isClosing, errorMessage, reset } =
    useDeletePlayroom(playroomId);

  const handleRoomEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalDismiss = () => {
    setIsEditModalOpen(false);
  };

  const handleRoomClose = () => {
    reset();
    setIsCloseModalOpen(true);
  };

  const handleCloseModalDismiss = () => {
    if (isClosing) return;

    setIsCloseModalOpen(false);
  };

  const handleRoomCloseConfirm = () => {
    if (isClosing) return;

    closePlayroom();
  };

  return (
    <div className="mx-2 flex items-center justify-between">
      <BackButton
        staticUrl="/stage"
        fallbackUrl="/stage"
        onBeforeNavigate={onBeforeBack}
      />

      <h1 className="text-text-primary text-base">{playroomTitle}</h1>
      {isHost ? (
        <KebabModal>
          <KebabModal.Item onClick={handleRoomEdit}>
            방 정보 수정
          </KebabModal.Item>
          <KebabModal.Item onClick={handleRoomClose} variant="danger">
            플레이룸 종료
          </KebabModal.Item>
        </KebabModal>
      ) : (
        <div className="w-6" />
      )}

      <PlayroomEditModal
        isOpen={isEditModalOpen}
        playroomId={playroomId}
        initialTitle={playroomTitle}
        initialDescription={playroomDescription}
        onClose={handleEditModalDismiss}
      />

      <PlayroomCloseModal
        isOpen={isCloseModalOpen}
        isClosing={isClosing}
        errorMessage={errorMessage}
        onClose={handleCloseModalDismiss}
        onConfirm={handleRoomCloseConfirm}
      />
    </div>
  );
}
