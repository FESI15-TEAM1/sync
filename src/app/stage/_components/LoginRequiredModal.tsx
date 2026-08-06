'use client';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

type LoginRequiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onConfirm,
}: LoginRequiredModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Body>
        <h2 className="text-text-primary text-center text-lg font-bold">
          로그인이 필요합니다
        </h2>
        <p className="text-text-secondary mt-2 text-center text-sm">
          플레이룸을 만들려면 로그인이 필요합니다.
          <br /> 로그인 페이지로 이동하시겠습니까?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="md"
          variant="outline"
          onClick={onClose}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          취소
        </Button>
        <Button
          type="button"
          size="md"
          variant="primary"
          onClick={onConfirm}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          로그인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
