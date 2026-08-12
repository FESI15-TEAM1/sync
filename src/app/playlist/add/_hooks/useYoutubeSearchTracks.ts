'use client';

import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import type { PlaylistTrack } from '@/services/playlist/playlist';
import { searchYoutubeTracks } from '@/services/youtube/youtube.api';

const PAGE_SIZE = 10;
// 이미 추가된 곡을 계속 걸러내다 검색어에 결과가 거의 없을 때 API 호출이 무한히 이어지지 않도록 검색 1회당 추가 페칭 횟수를 제한합니다.
const MAX_AUTO_FETCH = 5;

/**
 * 유튜브 검색 결과에서 이미 추가된 곡(addedVideoIds)을 제외하고,
 * 화면에 보여줄 분량이 한 페이지(10개) 이하로 남으면 다음 페이지를 이어서 불러와 채웁니다.
 * 추가된 곡 목록이 바뀌면 다시 검색하지 않아도 필터링 결과가 자동으로 갱신됩니다.
 */
export function useYoutubeSearchTracks(addedVideoIds: Set<string>) {
  const [query, setQuery] = useState('');
  const [rawTracks, setRawTracks] = useState<PlaylistTrack[]>([]);
  const [nextPageToken, setNextPageToken] = useState<
    string | null | undefined
  >(undefined);
  const [page, setPage] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const fetchCountRef = useRef(0);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (pageToken?: string) => searchYoutubeTracks(query, pageToken),
  });

  const filteredTracks = rawTracks.filter(
    (track) => !addedVideoIds.has(track.videoId),
  );

  useEffect(() => {
    if (!query) return;
    if (isFetchingRef.current) return;
    if (nextPageToken === null) return;
    if (fetchCountRef.current >= MAX_AUTO_FETCH) return;
    if (filteredTracks.length > (page + 1) * PAGE_SIZE) return;

    isFetchingRef.current = true;
    fetchCountRef.current += 1;

    mutateAsync(nextPageToken ?? undefined)
      .then((result) => {
        setRawTracks((prev) => {
          const seen = new Set(prev.map((track) => track.videoId));
          return [
            ...prev,
            ...result.items.filter((item) => !seen.has(item.videoId)),
          ];
        });
        setNextPageToken(result.nextPageToken);
      })
      .catch(() => {
        setSearchError('검색 결과를 불러오지 못했습니다.');
      })
      .finally(() => {
        isFetchingRef.current = false;
      });
  }, [query, nextPageToken, filteredTracks.length, page, mutateAsync]);

  const search = (q: string) => {
    setQuery(q);
    setPage(0);
    setRawTracks([]);
    setNextPageToken(undefined);
    setSearchError(null);
    fetchCountRef.current = 0;
  };

  const hasNextPage = filteredTracks.length > (page + 1) * PAGE_SIZE;
  const hasPrevPage = page > 0;

  return {
    tracks: filteredTracks.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    page,
    hasNextPage,
    hasPrevPage,
    goToNextPage: () => setPage((prev) => (hasNextPage ? prev + 1 : prev)),
    goToPrevPage: () => setPage((prev) => Math.max(0, prev - 1)),
    search,
    isLoading: isPending,
    searchError,
  };
}
