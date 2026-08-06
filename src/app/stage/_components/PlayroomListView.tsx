'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { type ReactNode, useEffect, useRef } from 'react';

import PlayroomList from '@/components/domain/playroom/PlayroomList';
import { getPlayrooms } from '@/services/playroom/playroom.api';

export default function PlayroomListView() {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['playrooms'],
    queryFn: ({ pageParam }) => getPlayrooms({ cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    // nextCursor 가 null 이면 마지막 페이지입니다.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    retry: false,
  });

  // 목록 끝의 감지용 요소가 화면에 들어오면 다음 페이지를 이어서 불러옵니다.
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchNextPage();
    });
    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <StatusMessage className="text-text-secondary">
        현재 라이브 중인 플레이룸을 불러오는 중입니다!
      </StatusMessage>
    );
  }

  if (isError) {
    return (
      <StatusMessage className="text-red-500">
        플레이룸을 불러오는데 실패하였습니다.
      </StatusMessage>
    );
  }

  const playrooms = data.pages.flatMap((page) => page.items);

  if (playrooms.length === 0) {
    return (
      <StatusMessage className="text-text-primary">
        현재 라이브 중인 플레이룸이 존재하지 않습니다.
      </StatusMessage>
    );
  }

  return (
    <>
      <PlayroomList data={playrooms} />

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetchingNextPage && (
            <p className="text-text-secondary text-sm">
              플레이룸을 더 불러오는 중입니다...
            </p>
          )}
        </div>
      )}
    </>
  );
}

function StatusMessage({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh_-_var(--global-header-height)_-_2rem)] items-center justify-center">
      <p className={className}>{children}</p>
    </div>
  );
}
