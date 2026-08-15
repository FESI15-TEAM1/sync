import { useQuery } from '@tanstack/react-query';

import {
  MAIN_PLAYROOM_COUNT,
  MAIN_PLAYROOM_FETCH_LIMIT,
} from '@/constants/playroom';
import { getPublicPlaylists } from '@/services/playlist/playlist.api';
import { getMainPlayrooms } from '@/services/playroom/playroom.api';

export function useGetPublicPlaylists() {
  return useQuery({
    queryKey: ['publicPlaylists'],
    queryFn: getPublicPlaylists,
  });
}

// 라이브가 끝난 방이 섞여 들어와 걸러지더라도 3개를 채울 수 있도록 여유분을 받아옵니다.

export const mainPlayroomListQueryKey = () =>
  ['playrooms', 'list', 'main'] as const;

/** 메인 상단에 노출할, 최근 개설된 라이브 플레이룸 3개를 조회합니다. */
export function useGetMainPlayrooms() {
  return useQuery({
    queryKey: mainPlayroomListQueryKey(),
    queryFn: () => getMainPlayrooms({ limit: MAIN_PLAYROOM_FETCH_LIMIT }),
    // 라이브만 걸러진 목록이 최신순으로 내려오므로 앞에서 3개만 씁니다.
    select: (data) => data.items.slice(0, MAIN_PLAYROOM_COUNT),
  });
}
