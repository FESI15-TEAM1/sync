'use client';

import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import type { PlaylistTrack } from '@/services/playlist/playlist';
import { searchYoutubeTracks } from '@/services/youtube/youtube.api';

/**
 * 유튜브 검색 결과를 페이지 단위(요청 1회 = 1페이지)로 불러옵니다.
 * 각 페이지에서 이미 추가된 곡(addedVideoIds)만 화면에서 걸러내고,
 * 다음 페이지는 사용자가 "다음" 버튼을 눌렀을 때만 요청합니다.
 */
export function useYoutubeSearchTracks(addedVideoIds: Set<string>) {
  const [rawPages, setRawPages] = useState<PlaylistTrack[][]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);

  const queryRef = useRef('');
  // search()가 새로 호출되면 세대를 올려, 이전 검색어의 응답이 늦게 도착해도
  // 이미 리셋된 상태(rawPages/nextPageToken)에 섞여 들어가지 않도록 폐기한다.
  const generationRef = useRef(0);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ q, pageToken }: { q: string; pageToken?: string }) =>
      searchYoutubeTracks(q, pageToken),
  });

  const fetchAndAppendPage = (
    pageToken: string | undefined,
    generation: number,
  ) =>
    mutateAsync({ q: queryRef.current, pageToken })
      .then((result) => {
        if (generation !== generationRef.current) return null;
        setRawPages((prev) => [...prev, result.items]);
        setNextPageToken(result.nextPageToken);
        setSearchError(null);
        return result;
      })
      .catch(() => {
        if (generation !== generationRef.current) return null;
        setSearchError('검색 결과를 불러오지 못했습니다.');
        return null;
      });

  const search = (q: string) => {
    generationRef.current += 1;
    const generation = generationRef.current;
    queryRef.current = q;
    setPage(0);
    setRawPages([]);
    setNextPageToken(null);
    setSearchError(null);
    fetchAndAppendPage(undefined, generation);
  };

  const goToNextPage = () => {
    const nextIndex = page + 1;
    if (nextIndex < rawPages.length) {
      setPage(nextIndex);
      return;
    }
    if (nextPageToken == null) return;

    fetchAndAppendPage(nextPageToken, generationRef.current).then((result) => {
      if (result) setPage(nextIndex);
    });
  };

  const goToPrevPage = () => setPage((prev) => Math.max(0, prev - 1));

  const filteredTracks = (rawPages[page] ?? []).filter(
    (track) => !addedVideoIds.has(track.videoId),
  );
  const hasNextPage = page + 1 < rawPages.length || nextPageToken != null;
  const hasPrevPage = page > 0;

  return {
    tracks: filteredTracks,
    page,
    hasNextPage,
    hasPrevPage,
    goToNextPage,
    goToPrevPage,
    search,
    isLoading: isPending,
    searchError,
  };
}
