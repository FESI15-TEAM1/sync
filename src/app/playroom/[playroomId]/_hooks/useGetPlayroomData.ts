import { useQuery } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import { getPlayroomDetail } from '@/services/playroom/playroomDetail.api';

/** 참가자 입퇴장처럼 WebSocket 으로 알게 된 변화를 이 쿼리에 반영하려면 이 키를 무효화합니다. */
export const playroomQueryKey = (playroomId: number) =>
  ['playrooms', playroomId] as const;

export function useGetPlayroomData(playroomId: number) {
  const {
    data: playroomData,
    error,
    isPending,
  } = useQuery({
    queryKey: playroomQueryKey(playroomId),
    queryFn: () => getPlayroomDetail(playroomId),
  });

  const errorMessage = error
    ? error instanceof APIError
      ? error.message
      : '플레이룸 정보를 가져오는 중 오류가 발생했습니다.'
    : null;

  return { playroomData, errorMessage, isPending };
}
