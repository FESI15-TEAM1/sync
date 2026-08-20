'use client';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

type HostLeaveModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/** 방장이 페이지를 벗어나려 할 때 동기화가 끊긴다는 것을 알려주는 안내입니다. */
export default function HostLeaveModal({
  isOpen,
  onCancel,
  onConfirm,
}: HostLeaveModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      ariaLabelledBy="host-leave-modal-title"
    >
      <Modal.Body>
        <h2
          id="host-leave-modal-title"
          className="text-text-primary text-center text-lg font-bold"
        >
          플레이룸을 벗어날까요?
        </h2>
        <p className="text-text-secondary mt-2 text-center text-sm">
          방장이 페이지를 벗어나면 재생 동기화가 종료되어
          <br /> 참가자에게 음악이 전달되지 않습니다.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="md"
          variant="outline"
          onClick={onConfirm}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          나가기
        </Button>
        <Button
          type="button"
          size="md"
          variant="primary"
          onClick={onCancel}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          머무르기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
