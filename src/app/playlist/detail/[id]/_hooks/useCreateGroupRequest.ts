'use client';

import { useMutation } from '@tanstack/react-query';

import { clientFetch } from '@/lib/http/client-fetch';
import { APIError } from '@/lib/http/error';
import type { GroupRequestResponse } from '@/services/group/group.types';

export function useCreateGroupRequest() {
  return useMutation({
    mutationFn: (playlistId: number) =>
      clientFetch<GroupRequestResponse>('/group-requests', {
        method: 'POST',
        body: { sourceType: 'playlist', sourceId: playlistId },
      }),
    onError: (error) => {
      alert(
        error instanceof APIError
          ? error.message
          : '그룹 생성 요청에 실패했습니다.',
      );
    },
  });
}
