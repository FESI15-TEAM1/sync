import { useMutation, useQueryClient } from '@tanstack/react-query';

import { myPlayroomListQueryKey } from '@/app/stage/_hooks/useGetMyPlayroomList';
import { playroomListQueryKey } from '@/app/stage/_hooks/useGetPlayroomList';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { patchPlayroom } from '@/services/playroom/playroomDetail.api';
import type { PlayroomUpdateRequest } from '@/services/playroom/playroomDetail.types';

import { playroomQueryKey } from './useGetPlayroomData';

const EDIT_ERROR_MESSAGE =
  '방 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.';

export function useEditPlayroom(playroomId: number) {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

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
      queryClient.setQueryData(playroomQueryKey(playroomId), updatedPlayroom);
      // 목록 카드에도 제목·설명이 노출되므로 두 목록을 stale 로만 표시해 둡니다.
      // 방 안에서는 /stage 가 떠 있지 않아 지금 다시 불러오지 않고, 나중에 /stage 로 돌아올 때 갱신됩니다.
      queryClient.invalidateQueries({ queryKey: playroomListQueryKey() });
      queryClient.invalidateQueries({
        queryKey: myPlayroomListQueryKey(userId),
      });
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
