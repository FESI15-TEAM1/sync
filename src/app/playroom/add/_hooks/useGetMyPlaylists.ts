import { useQuery } from '@tanstack/react-query';

import { useUserStore } from '@/providers/user-store-provider';
import { getUserPlaylists } from '@/services/playlist/playlist.api';
import type { MyPlaylistItem } from '@/services/playlist/playlistCard.type';

// 스펙상 한 페이지 최대 개수. 커서로 끝까지 모아 모든 플레이리스트를 선택할 수 있게 합니다.
const PLAYLIST_PAGE_SIZE = 50;
const MAX_PLAYLIST_PAGES = 10;

const STALE_TIME = 30_000;

// QueryClient 가 앱 전역에 살아있어 계정을 바꿔도 캐시가 남습니다. 이전 계정의 목록을 보여주지 않도록 키를 유저별로 나눕니다.
export const myPlaylistsQueryKey = (userId: number | undefined) =>
  ['playlists', 'me', userId] as const;

async function fetchAllMyPlaylists(userId: number) {
  const playlists: MyPlaylistItem[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PLAYLIST_PAGES; page++) {
    const data = await getUserPlaylists(userId, {
      limit: PLAYLIST_PAGE_SIZE,
      cursor,
    });

    // 트랙이 없는 플레이리스트는 공유해도 재생할 수 없으므로 선택지에서 제외합니다.
    playlists.push(...data.items.filter((item) => item.trackCount > 0));

    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return playlists;
}

/**
 * 플레이룸에 공유할 수 있는 내 플레이리스트(트랙이 1곡 이상)를 모두 조회합니다.
 * 회원 전용이라, 로그인한 유저가 확인되기 전에는 요청하지 않습니다.
 */
export function useGetMyPlaylists() {
  const userId = useUserStore((state) => state.user?.id);
  const isUserLoading = useUserStore((state) => state.isLoading);
  const isEnabled = userId !== undefined;

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: myPlaylistsQueryKey(userId),
    queryFn: () => {
      if (userId === undefined) throw new Error('로그인 정보가 없습니다.');
      return fetchAllMyPlaylists(userId);
    },
    enabled: isEnabled,
    staleTime: STALE_TIME,
  });

  return {
    playlists: data,
    // enabled 가 false 인 동안에도 isPending 은 true 라서, 유저 조회 중과 실제 목록 요청 중만 로딩으로 봅니다.
    isLoading: isUserLoading || (isEnabled && isPending),
    isError,
    refetch,
  };
}
