'use client';

import { type ReactNode } from 'react';

import Button from './Button';
import Modal from './Modal';

type ConfirmModalProps = {
  isOpen: boolean;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  confirmingLabel?: string;
  errorMessage?: string | null;
  destructive?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  isConfirming = false,
  confirmingLabel = '처리 중...',
  errorMessage,
  destructive = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick={!isConfirming}
      ariaLabelledBy="confirm-modal-title"
    >
      <Modal.Body>
        <h2
          id="confirm-modal-title"
          className="text-text-primary text-center text-lg font-bold"
        >
          {title}
        </h2>

        {description && (
          <p className="text-text-secondary mt-2 text-center text-sm">
            {description}
          </p>
        )}

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
          isDisabled={isConfirming}
          onClick={onClose}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          size="md"
          variant="primary"
          isDisabled={isConfirming}
          onClick={onConfirm}
          className={
            destructive
              ? 'flex h-9 w-28 shrink-0 items-center justify-center rounded-full bg-red-500 px-0 font-bold hover:bg-red-600'
              : 'flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold'
          }
        >
          {isConfirming ? confirmingLabel : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
