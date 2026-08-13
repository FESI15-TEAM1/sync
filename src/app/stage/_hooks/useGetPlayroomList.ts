import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { getPlayrooms } from '@/services/playroom/playroom.api';

const PAGE_SIZE = 10;
const STALE_TIME = 30_000;
// 바닥에 닿기 전에 미리 다음 페이지를 불러와 스크롤이 끊기지 않게 합니다.
const LOAD_MORE_ROOT_MARGIN = '200px';

// ['playrooms'] 를 그대로 쓰면 방 상세·채팅까지 같은 prefix 에 걸리므로 목록은 한 칸 아래에 둡니다.
export const playroomListQueryKey = () => ['playrooms', 'list'] as const;

/**
 * 라이브 플레이룸 목록을 커서 기반으로 이어서 불러옵니다.
 * 반환하는 loadMoreRef 를 목록 끝에 두면 화면에 들어올 때 다음 페이지를 자동으로 요청합니다.
 */
export function useGetPlayroomList() {
  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
  } = useInfiniteQuery({
    queryKey: playroomListQueryKey(),
    queryFn: ({ pageParam }) =>
      getPlayrooms({ cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    // nextCursor 가 null 이면 마지막 페이지입니다.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    retry: false,
    // 누적된 페이지를 매번 다시 불러오지 않도록 짧은 신선도를 둡니다.
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  // 목록 끝의 감지용 요소가 화면에 들어오면 다음 페이지를 이어서 불러옵니다.
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    // 백그라운드 refetch 등 진행 중인 요청이 있으면 다음 페이지 요청과 충돌하므로 관찰하지 않습니다.
    // 다음 페이지 요청이 실패한 뒤에는 자동 재요청이 반복되지 않도록 재시도 버튼으로만 이어받습니다.
    if (!target || !hasNextPage || isFetching || isFetchNextPageError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetching) fetchNextPage();
      },
      { rootMargin: LOAD_MORE_ROOT_MARGIN },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, isFetchNextPageError, fetchNextPage]);

  return {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    // 첫 조회 실패 화면에서 다시 시도하는 동안 버튼을 잠그기 위해 함께 노출합니다.
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
    loadMoreRef,
  };
}
