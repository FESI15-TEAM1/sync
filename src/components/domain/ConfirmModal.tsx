'use client';

import clsx from 'clsx';
import { type ReactNode, useId } from 'react';

import Button from '@/components/Button';
import Modal from '@/components/Modal';

/** 확인 버튼의 성격. danger는 되돌릴 수 없는 동작(삭제·종료·강퇴 등)에 씁니다. */
type ConfirmVariant = 'primary' | 'danger';

type ConfirmModalProps = {
  isOpen: boolean;
  title: ReactNode;
  description?: ReactNode;
  variant?: ConfirmVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  /** false면 확인 버튼만 보여줍니다(단순 안내용). */
  hasCancel?: boolean;
  isConfirming?: boolean;
  confirmingLabel?: string;
  errorMessage?: string | null;
  closeOnBackdropClick?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const BUTTON_BASE =
  'flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold';

/**
 * 확인/취소 두 개의 선택지를 주는 공용 확인 모달입니다.
 * 문구와 버튼 성격만 넘기면 되고, 레이아웃은 이 컴포넌트가 고정합니다.
 */
export default function ConfirmModal({
  isOpen,
  title,
  description,
  variant = 'primary',
  confirmLabel = '확인',
  cancelLabel = '취소',
  hasCancel = true,
  isConfirming = false,
  confirmingLabel = '처리 중...',
  errorMessage,
  closeOnBackdropClick = true,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const titleId = useId();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // 처리 중에는 배경 클릭으로 닫히지 않게 합니다.
      closeOnBackdropClick={closeOnBackdropClick && !isConfirming}
      ariaLabelledBy={titleId}
    >
      <Modal.Body>
        <h2
          id={titleId}
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
        {hasCancel && (
          <Button
            type="button"
            size="md"
            variant="outline"
            isDisabled={isConfirming}
            onClick={onClose}
            className={BUTTON_BASE}
          >
            {cancelLabel}
          </Button>
        )}

        <Button
          type="button"
          size="md"
          variant="primary"
          isDisabled={isConfirming}
          onClick={onConfirm}
          className={clsx(
            BUTTON_BASE,
            variant === 'danger' && 'bg-red-500 hover:bg-red-600',
          )}
        >
          {isConfirming ? confirmingLabel : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
