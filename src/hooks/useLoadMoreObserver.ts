import { useEffect, useRef } from 'react';

interface UseLoadMoreObserverParams {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  rootMargin?: string;
}

const DEFAULT_ROOT_MARGIN = '200px';
// 옵저벼가 경계하는 값보다 200px넓게 보기위함
export function useLoadMoreObserver({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = DEFAULT_ROOT_MARGIN,
}: UseLoadMoreObserverParams) {
  const stateRef = useRef({ hasNextPage, isFetchingNextPage, fetchNextPage });

  useEffect(() => {
    stateRef.current = { hasNextPage, isFetchingNextPage, fetchNextPage };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  // 옵저버 외부에서 동작하므로 옵저버 의존성배열이 분리되어 해당 값들이 바뀌어도 옵져버가 매번 재생성되지않음
  const loadMoreRef = useRef<HTMLDivElement>(null);
  // 반환되는 ref의 값 이값으로 컴포넌트에서 어떤 레프를 감지할것인지 확인

  useEffect(() => {
    if (!hasNextPage) return;
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { hasNextPage, isFetchingNextPage, fetchNextPage } =
          stateRef.current;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, rootMargin]);

  return loadMoreRef;
}
