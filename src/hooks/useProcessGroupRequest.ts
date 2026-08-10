'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import { processGroupRequest } from '@/services/group/groupRequests.api';
import type { ProcessGroupRequestPayload } from '@/services/group/groupRequests.type';

export function useProcessGroupRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      payload,
    }: {
      requestId: number;
      payload: ProcessGroupRequestPayload;
    }) => processGroupRequest(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-requests'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: (error) => {
      alert(
        error instanceof APIError ? error.message : '요청 처리에 실패했습니다.',
      );
    },
  });
}
