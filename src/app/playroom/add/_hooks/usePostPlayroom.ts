import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { postPlayroom } from '@/services/playroom/playroom.api';
import type { PlayroomCreateRequest } from '@/services/playroom/playroom.types';

const CREATE_ERROR_MESSAGE =
  '플레이룸 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';

export function usePostPlayroom() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: createPlayroom,
    isPending,
    isSuccess,
    error,
    reset,
  } = useMutation({
    mutationFn: (form: PlayroomCreateRequest) => postPlayroom(form),
    onSuccess: ({ id }) => {
      // 새로 만든 방이 목록 카드에 바로 보이도록 목록만 갱신합니다.
      queryClient.invalidateQueries({ queryKey: ['playrooms'], exact: true });

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
