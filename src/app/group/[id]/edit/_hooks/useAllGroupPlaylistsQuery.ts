import { useQuery } from '@tanstack/react-query';

import { groupPlaylistsQueryKey } from '@/app/group/[id]/_hooks/useGroupPlaylists';
import { getGroupPlaylists } from '@/services/group/group.api';
import type { GroupPlaylistResponse } from '@/services/group/group.types';

// 스펙상 한 페이지 최대 개수. 커서로 끝까지 모아 전체 목록을 확보한다.
const PLAYLIST_PAGE_SIZE = 50;
const MAX_PAGES = 10;

async function fetchAllGroupPlaylists(groupId: number) {
  const items: GroupPlaylistResponse[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await getGroupPlaylists(groupId, {
      cursor,
      limit: PLAYLIST_PAGE_SIZE,
    });

    items.push(...data.items);

    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return items;
}

// 편집 화면에서 잠금 대상(그룹장이 아닌 사람이 담은 항목)을 계산하려면
// 무한 스크롤이 아니라 전체 목록을 한 번에 확보해야 한다.
export function useAllGroupPlaylistsQuery(groupId: number) {
  return useQuery({
    queryKey: [...groupPlaylistsQueryKey(groupId), 'all'],
    queryFn: () => fetchAllGroupPlaylists(groupId),
  });
}
