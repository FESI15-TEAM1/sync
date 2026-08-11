'use client';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

type RoomClosedModalProps = {
  isOpen: boolean;
  onConfirm: () => void;
};

/** 방장이 방을 종료했을 때 참가자에게 보여주는 안내입니다. 확인하면 방을 나갑니다. */
export default function RoomClosedModal({
  isOpen,
  onConfirm,
}: RoomClosedModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onConfirm}
      // 이미 종료된 방이라 남아 있을 수 없으므로, 배경 클릭으로 닫지 못하게 합니다.
      closeOnBackdropClick={false}
      ariaLabelledBy="room-closed-modal-title"
    >
      <Modal.Body>
        <h2
          id="room-closed-modal-title"
          className="text-text-primary text-center text-lg font-bold"
        >
          플레이룸이 종료되었습니다
        </h2>
        <p className="text-text-secondary mt-2 text-center text-sm">
          방장이 플레이룸을 종료했습니다.
          <br /> 확인을 누르면 플레이룸 목록으로 이동합니다.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="md"
          variant="primary"
          onClick={onConfirm}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
