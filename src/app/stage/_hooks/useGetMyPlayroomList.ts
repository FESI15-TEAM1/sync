import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/providers/user-store-provider';
import { getMyPlayrooms } from '@/services/playroom/playroom.api';

const STALE_TIME = 30_000;

// QueryClient 가 앱 전역에 살아있어 계정을 바꿔도 캐시가 남습니다. 이전 계정의 목록을 보여주지 않도록 키를 유저별로 나눕니다.
export const myPlayroomListQueryKey = (userId: number | undefined) =>
  ['playrooms', 'me', userId] as const;

/**
 * 내가 만든 플레이룸 목록을 조회합니다.
 * 개설 상한이 5개라 페이지네이션 없이 한 번에 받아옵니다.
 * 회원 전용이라, 로그인한 유저가 확인되기 전에는 요청하지 않습니다.
 */
export function useGetMyPlayroomList() {
  const userId = useUserStore((state) => state.user?.id);
  const isEnabled = userId !== undefined;

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: myPlayroomListQueryKey(userId),
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
