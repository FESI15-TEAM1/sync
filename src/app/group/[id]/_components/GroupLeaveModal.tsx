'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { groupsQueryKey } from '@/app/group/_hooks/useGroupsQuery';
import Button from '@/components/Button';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { leaveGroup } from '@/services/group/group.api';

type GroupLeaveModalProps = {
  isOpen: boolean;
  groupId: number;
  groupName: string;
  onClose: () => void;
};

export default function GroupLeaveModal({
  isOpen,
  ...props
}: GroupLeaveModalProps) {
  if (!isOpen) return null;
  return <GroupLeaveModalContent {...props} />;
}

function GroupLeaveModalContent({
  groupId,
  groupName,
  onClose,
}: Omit<GroupLeaveModalProps, 'isOpen'>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);

  const leaveGroupMutation = useMutation({
    mutationFn: () => {
      if (!currentUser) throw new Error('로그인이 필요합니다.');
      return leaveGroup(groupId, currentUser.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKey() });
      onClose();
      router.push('/group');
    },
    onError: (error) => {
      if (error instanceof APIError) {
        console.error(error.message);
        alert(error.message);
        return;
      }

      console.error(error);
      alert('그룹 탈퇴 중 오류가 발생했습니다.');
    },
  });

  const handleConfirmLeave = () => {
    if (!currentUser) return;
    leaveGroupMutation.mutate();
  };

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
            isDisabled={leaveGroupMutation.isPending}
            onClick={handleConfirmLeave}
            className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full bg-red-500 px-0 font-bold hover:bg-red-600"
          >
            탈퇴하기
          </Button>
        </div>
      </div>
    </div>
  );
}
