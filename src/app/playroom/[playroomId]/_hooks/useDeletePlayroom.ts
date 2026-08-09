import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { deletePlayroom } from '@/services/playroom/playroomDetail.api';

const CLOSE_ERROR_MESSAGE =
  '플레이룸 종료에 실패했습니다. 잠시 후 다시 시도해주세요.';

export function useDeletePlayroom(playroomId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: closePlayroom,
    isPending,
    isSuccess,
    error,
    reset,
  } = useMutation({
    mutationFn: () => deletePlayroom(playroomId),
    onSuccess: () => {
      // 종료된 방은 더 이상 조회할 수 없으므로 캐시에서 지우고 목록만 갱신합니다.
      queryClient.removeQueries({ queryKey: ['playrooms', playroomId] });
      queryClient.invalidateQueries({ queryKey: ['playrooms'], exact: true });

      router.replace('/stage');
      router.refresh();
    },
  });

  return {
    closePlayroom,
    // 성공 시에는 페이지 이동이 끝날 때까지 종료 상태를 유지해 중복 요청을 막습니다.
    isClosing: isPending || isSuccess,
    errorMessage: error
      ? error instanceof APIError
        ? error.message
        : CLOSE_ERROR_MESSAGE
      : null,
    reset,
  };
}
