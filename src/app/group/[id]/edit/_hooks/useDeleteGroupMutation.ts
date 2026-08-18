'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { deleteGroup } from '@/services/group/group.api';

export function useDeleteGroupMutation({
  onError,
}: {
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: number) => deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      router.push('/group');
    },
    onError: (error) => {
      onError(
        error instanceof APIError
          ? error.message
          : '그룹 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });
}
