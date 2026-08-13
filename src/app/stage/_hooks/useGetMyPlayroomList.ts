import { useQuery } from '@tanstack/react-query';

import { getMyPlayrooms } from '@/services/playroom/playroom.api';

const STALE_TIME = 30_000;

export const myPlayroomListQueryKey = () => ['playrooms', 'me'] as const;

/**
 * 내가 만든 플레이룸 목록을 조회합니다.
 * 개설 상한이 5개라 페이지네이션 없이 한 번에 받아옵니다.
 * 회원 전용이라, 로그인 여부가 확실하지 않은 곳에서는 isEnabled 로 요청을 막습니다.
 */
export function useGetMyPlayroomList(isEnabled = true) {
  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: myPlayroomListQueryKey(),
    queryFn: getMyPlayrooms,
    enabled: isEnabled,
    retry: false,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    playrooms: data?.items,
    // enabled 가 false 인 동안에도 isPending 은 true 라서, 실제로 불러오는 중일 때만 로딩으로 봅니다.
    isLoading: isEnabled && isPending,
    isFetching,
    isError,
    refetch,
  };
}
