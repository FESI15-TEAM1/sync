import { useQuery } from '@tanstack/react-query';

import { getPublicPlaylists } from '@/services/playlist/playlist.api';
import { getMainPlayrooms } from '@/services/playroom/playroom.api';

export function useGetPublicPlaylists() {
  return useQuery({
    queryKey: ['publicPlaylists'],
    queryFn: getPublicPlaylists,
  });
}

export const mainPlayroomListQueryKey = () =>
  ['playrooms', 'list', 'main'] as const;

/** 메인 상단에 노출할, 청취자 많은 순 라이브 플레이룸을 조회합니다. */
export function useGetMainPlayrooms() {
  return useQuery({
    queryKey: mainPlayroomListQueryKey(),
    queryFn: () => getMainPlayrooms(),
    select: (data) => data.items,
  });
}
