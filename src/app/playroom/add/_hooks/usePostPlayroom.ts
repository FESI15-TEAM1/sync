import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { myPlayroomListQueryKey } from '@/app/stage/_hooks/useGetMyPlayroomList';
import { playroomListQueryKey } from '@/app/stage/_hooks/useGetPlayroomList';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { postPlayroom } from '@/services/playroom/playroom.api';
import type { PlayroomCreateRequest } from '@/services/playroom/playroom.types';

const CREATE_ERROR_MESSAGE =
  '플레이룸 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';

export function usePostPlayroom() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

  const {
    mutate: createPlayroom,
    isPending,
    isSuccess,
    error,
    reset,
  } = useMutation({
    mutationFn: (form: PlayroomCreateRequest) => postPlayroom(form),
    onSuccess: ({ id }) => {
      // 새로 만든 방이 /stage 의 전체 목록과 내 플레이룸 목록 양쪽에 바로 보이도록 둘 다 갱신합니다.
      queryClient.invalidateQueries({ queryKey: playroomListQueryKey() });
      queryClient.invalidateQueries({
        queryKey: myPlayroomListQueryKey(userId),
      });

      router.push(`/playroom/${id}`);
    },
  });

  return {
    createPlayroom,
    // 성공 시에는 페이지 이동이 끝날 때까지 제출 상태를 유지해 중복 생성을 막습니다.
    isCreating: isPending || isSuccess,
    errorMessage: error
      ? error instanceof APIError
        ? error.message
        : CREATE_ERROR_MESSAGE
      : null,
    reset,
  };
}
