import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { myPlayroomListQueryKey } from '@/app/stage/_hooks/useGetMyPlayroomList';
import { playroomListQueryKey } from '@/app/stage/_hooks/useGetPlayroomList';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { deletePlayroom } from '@/services/playroom/playroomDetail.api';

import { playroomQueryKey } from './useGetPlayroomData';

const CLOSE_ERROR_MESSAGE =
  '플레이룸 종료에 실패했습니다. 잠시 후 다시 시도해주세요.';

export function useDeletePlayroom(playroomId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

  const {
    mutate: closePlayroom,
    isPending,
    isSuccess,
    error,
    reset,
  } = useMutation({
    mutationFn: () => deletePlayroom(playroomId),
    onSuccess: () => {
      // 종료된 방은 더 이상 조회할 수 없으므로 상세·채팅 캐시를 통째로 지웁니다.
      queryClient.removeQueries({ queryKey: playroomQueryKey(playroomId) });
      // 방장이 종료한 방이라 /stage 의 전체 목록과 내 플레이룸 목록 양쪽에서 빠져야 합니다.
      queryClient.invalidateQueries({ queryKey: playroomListQueryKey() });
      queryClient.invalidateQueries({
        queryKey: myPlayroomListQueryKey(userId),
      });

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
