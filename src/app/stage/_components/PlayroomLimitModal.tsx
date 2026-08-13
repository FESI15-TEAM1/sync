'use client';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { MY_PLAYROOM_MAX_COUNT } from '@/constants/playroom';

type PlayroomLimitModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PlayroomLimitModal({
  isOpen,
  onClose,
}: PlayroomLimitModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabelledBy="playroom-limit-modal-title"
    >
      <Modal.Body>
        <h2
          id="playroom-limit-modal-title"
          className="text-text-primary text-center text-lg font-bold"
        >
          최대 생성 가능 개수에 도달하였습니다
        </h2>
        <p className="text-text-secondary mt-2 text-center text-sm">
          플레이룸은 최대 {MY_PLAYROOM_MAX_COUNT}개까지 만들 수 있습니다.
          <br /> 기존 플레이룸을 닫은 뒤 다시 시도해주세요.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="md"
          variant="primary"
          onClick={onClose}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
