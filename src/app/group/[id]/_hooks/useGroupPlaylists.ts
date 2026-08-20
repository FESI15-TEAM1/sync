'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { getGroupPlaylists } from '@/services/group/group.api';
import type { GroupPlaylistResponse } from '@/services/group/group.types';

import type { EditablePlaylist } from '../_components/PlaylistEditModal';

// 그룹 플레이리스트 무한 스크롤 한 페이지 개수
const PLAYLIST_PAGE_SIZE = 20;
// 바닥에 닿기 전에 미리 다음 페이지를 불러와 스크롤이 끊기지 않게 합니다.
const LOAD_MORE_ROOT_MARGIN = '200px';

export const groupPlaylistsQueryKey = (groupId: number) =>
  ['group', groupId, 'playlists'] as const;

// 그룹에 추가된 플레이리스트(커서 기반 무한 스크롤)
export function useGroupPlaylists(groupId: number) {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: groupPlaylistsQueryKey(groupId),
    queryFn: ({ pageParam }) =>
      getGroupPlaylists(groupId, {
        cursor: pageParam,
        limit: PLAYLIST_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    // nextCursor가 null이면 마지막 페이지입니다.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  // 목록 끝의 감지용 요소가 화면에 들어오면 다음 페이지를 이어서 불러옵니다.
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
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

  const handleRetryFetchPlaylists = () => {
    fetchNextPage();
  };

  const items: GroupPlaylistResponse[] =
    data?.pages.flatMap((page) => page.items) ?? [];

  // 하이라이트된 플레이리스트를 상단에 고정해서 보여준다
  const displayPlaylists = [...items].sort(
    (a, b) => Number(b.isHighlighted) - Number(a.isHighlighted),
  );

  const playlists: EditablePlaylist[] = items.map((item) => ({
    id: item.id,
    title: item.title,
    trackCount: item.trackCount,
    owner: item.owner.nickname,
    image: item.image,
    ownerId: item.owner.userId,
  }));

  return {
    playlists,
    displayPlaylists,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    loadMoreRef,
    handleRetryFetchPlaylists,
  };
}
