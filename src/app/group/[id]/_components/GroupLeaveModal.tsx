'use client';

import { useEffect } from 'react';

import Button from '@/components/Button';

type GroupLeaveModalProps = {
  isOpen: boolean;
  groupName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function GroupLeaveModal({
  isOpen,
  ...props
}: GroupLeaveModalProps) {
  if (!isOpen) return null;
  return <GroupLeaveModalContent {...props} />;
}

function GroupLeaveModalContent({
  groupName,
  onClose,
  onConfirm,
}: Omit<GroupLeaveModalProps, 'isOpen'>) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-leave-title"
        className="bg-bg-primary w-full max-w-xs rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="group-leave-title"
          className="text-text-primary text-center text-lg font-bold"
        >
          그룹 탈퇴
        </h2>
        <p className="text-text-secondary mt-2 text-center text-sm">
          {groupName} 그룹에서 탈퇴하시겠습니까?
        </p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <Button
            type="button"
            size="md"
            variant="outline"
            isDisabled={false}
            onClick={onClose}
            className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
          >
            취소
          </Button>
          <Button
            type="button"
            size="md"
            variant="primary"
            isDisabled={false}
            onClick={onConfirm}
            className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full bg-red-500 px-0 font-bold hover:bg-red-600"
          >
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  );
}
