'use client';

import { useState } from 'react';

import BackButton from '@/components/common/BackButton';
import ConfirmModal from '@/components/domain/ConfirmModal';
import KebabModal from '@/components/domain/KebabModal';
import LiveHeartbeat from '@/components/domain/playroom/LiveHeartbeat';

import { useDeletePlayroom } from '../_hooks/useDeletePlayroom';
import PlayroomEditModal from './PlayroomEditModal';

export default function PlayroomHeader({
  playroomId,
  playroomTitle,
  playroomDescription,
  isHost,
  onBeforeBack,
  isHostOnline,
}: {
  playroomId: number;
  playroomTitle: string;
  playroomDescription: string;
  isHost: boolean;
  /** 뒤로가기 직전에 호출됩니다. `false` 를 반환하면 이동하지 않습니다. */
  onBeforeBack?: () => boolean;
  isHostOnline: boolean;
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

      <h1 className="text-text-primary flex items-center gap-2 text-center text-base">
        {isHostOnline && <LiveHeartbeat size="md" />}
        {playroomTitle}
      </h1>

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

      {/* 플레이룸 방 정보 수정 모달 */}
      <PlayroomEditModal
        isOpen={isEditModalOpen}
        playroomId={playroomId}
        initialTitle={playroomTitle}
        initialDescription={playroomDescription}
        onClose={handleEditModalDismiss}
      />

      {/* 플레이룸 종료 확인 모달 */}
      <ConfirmModal
        isOpen={isCloseModalOpen}
        errorMessage={errorMessage}
        onClose={handleCloseModalDismiss}
        onConfirm={handleRoomCloseConfirm}
        title="플레이룸을 종료하시겠습니까?"
        variant="danger"
        description={
          <>
            종료하면 방이 목록에서 사라지고
            <br /> 대화와 재생 기록을 다시 볼 수 없습니다.
          </>
        }
        confirmLabel="종료하기"
        isConfirming={isClosing}
      />
    </div>
  );
}
