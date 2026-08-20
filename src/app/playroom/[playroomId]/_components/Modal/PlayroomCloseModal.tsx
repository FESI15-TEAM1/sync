'use client';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

type PlayroomCloseModalProps = {
  isOpen: boolean;
  isClosing: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function PlayroomCloseModal({
  isOpen,
  isClosing,
  errorMessage,
  onClose,
  onConfirm,
}: PlayroomCloseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // 종료 요청 중에는 배경 클릭으로 닫히지 않게 합니다.
      closeOnBackdropClick={!isClosing}
      ariaLabelledBy="playroom-close-modal-title"
    >
      <Modal.Body>
        <h2
          id="playroom-close-modal-title"
          className="text-text-primary text-center text-lg font-bold"
        >
          플레이룸을 종료할까요?
        </h2>
        <p className="text-text-secondary mt-2 text-center text-sm">
          종료하면 방이 목록에서 사라지고
          <br /> 대화와 재생 기록을 다시 볼 수 없습니다.
        </p>

        {errorMessage && (
          <p role="alert" className="mt-3 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="md"
          variant="outline"
          isDisabled={isClosing}
          onClick={onClose}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          취소
        </Button>
        <Button
          type="button"
          size="md"
          variant="primary"
          isDisabled={isClosing}
          onClick={onConfirm}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full bg-red-500 px-0 font-bold hover:bg-red-600"
        >
          {isClosing ? '종료 중...' : '종료하기'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
