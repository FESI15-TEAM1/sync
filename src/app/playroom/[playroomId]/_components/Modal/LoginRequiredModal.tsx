'use client';

import { useEffect } from 'react';

import Button from '@/components/Button';
import useFocusTrap from '@/hooks/useFocusTrap';

type LoginRequiredModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * 비회원이 플레이룸에 들어왔을 때 보여주는 안내입니다.
 * 방 내용을 볼 수 없어야 하므로 공용 Modal 대신 배경을 흐리게 가리는 오버레이를 씁니다.
 */
export default function LoginRequiredModal({
  isOpen,
  onCancel,
  onConfirm,
}: LoginRequiredModalProps) {
  const dialogRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-[10px]">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="playroom-login-required-modal-title"
        tabIndex={-1}
        className="bg-bg-primary flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl p-5 shadow-xl"
      >
        <div className="flex-1 scrollbar-none overflow-y-auto">
          <h2
            id="playroom-login-required-modal-title"
            className="text-text-primary text-center text-lg font-bold"
          >
            로그인이 필요합니다
          </h2>
          <p className="text-text-secondary mt-2 text-center text-sm">
            플레이룸에 참여하려면 로그인이 필요합니다.
            <br /> 로그인 페이지로 이동하시겠습니까?
          </p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <Button
            type="button"
            size="md"
            variant="outline"
            onClick={onCancel}
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
        </div>
      </div>
    </div>
  );
}
