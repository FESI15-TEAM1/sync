import { useQuery } from '@tanstack/react-query';

import { getUserPlaylists } from '@/services/playlist/playlist.api';
import type { MyPlaylistItem } from '@/services/playlist/playlistCard.type';

// 한 번에 다룰 플레이리스트 최대 개수(스펙상 페이지 최대치)
const PLAYLIST_QUERY_LIMIT = 50;
// 커서로 끝까지 모아 전체 목록을 확보하기 위한 최대 페이지 수
const MAX_PLAYLIST_PAGES = 10;

async function fetchAllUserPlaylists(userId: number) {
  const items: MyPlaylistItem[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PLAYLIST_PAGES; page++) {
    const data = await getUserPlaylists(userId, {
      cursor,
      limit: PLAYLIST_QUERY_LIMIT,
    });

    items.push(...data.items);

    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return items;
}

export const userPlaylistsQueryKey = (userId: number | undefined) =>
  ['user', userId, 'playlists'] as const;

// 내가 그룹에 추가할 수 있는 플레이리스트 소스(내 플레이리스트 전체)
export function useMyPlaylistsQuery(
  userId: number | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: userPlaylistsQueryKey(userId),
    queryFn: () => fetchAllUserPlaylists(userId!),
    enabled: enabled && userId !== undefined,
  });
}
