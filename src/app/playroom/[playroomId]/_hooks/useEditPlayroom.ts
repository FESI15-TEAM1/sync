import { useMutation, useQueryClient } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import { patchPlayroom } from '@/services/playroom/playroomDetail.api';
import type { PlayroomUpdateRequest } from '@/services/playroom/playroomDetail.types';

const EDIT_ERROR_MESSAGE =
  '방 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.';

export function useEditPlayroom(playroomId: number) {
  const queryClient = useQueryClient();

  const {
    mutate: editPlayroom,
    isPending,
    error,
    reset,
  } = useMutation({
    mutationFn: (form: PlayroomUpdateRequest) =>
      patchPlayroom(playroomId, form),
    onSuccess: (updatedPlayroom) => {
      // PATCH 응답이 방 상세 전체라서 다시 조회하지 않고 캐시를 바로 교체합니다.
      queryClient.setQueryData(['playrooms', playroomId], updatedPlayroom);
      // 목록 카드에도 제목·설명이 노출되므로 목록만 따로 갱신합니다.
      queryClient.invalidateQueries({ queryKey: ['playrooms'], exact: true });
    },
  });

  return {
    editPlayroom,
    isEditing: isPending,
    errorMessage: error
      ? error instanceof APIError
        ? error.message
        : EDIT_ERROR_MESSAGE
      : null,
    reset,
  };
}
