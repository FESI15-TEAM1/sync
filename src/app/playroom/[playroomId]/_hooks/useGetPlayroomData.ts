import { useQuery } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import { getPlayroomDetail } from '@/services/playroom/playroomDetail.api';

export function useGetPlayroomData(playroomId: number) {
  const {
    data: playroomData,
    error,
    isPending,
  } = useQuery({
    queryKey: ['playrooms', playroomId],
    queryFn: () => getPlayroomDetail(playroomId),
  });

  const errorMessage = error
    ? error instanceof APIError
      ? error.message
      : '플레이룸 정보를 가져오는 중 오류가 발생했습니다.'
    : null;

  return { playroomData, errorMessage, isPending };
}
