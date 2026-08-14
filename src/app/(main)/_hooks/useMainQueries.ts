import { useQuery } from '@tanstack/react-query';

import { getPublicPlaylists } from '@/services/playlist/playlist.api';
import { getPlayrooms } from '@/services/playroom/playroom.api';

export function useGetPublicPlaylists() {
  return useQuery({
    queryKey: ['publicPlaylists'],
    queryFn: getPublicPlaylists,
  });
}

/** 메인에 노출할 플레이룸 개수. */
export const MAIN_PLAYROOM_COUNT = 3;
// 라이브가 끝난 방이 섞여 들어와 걸러지더라도 3개를 채울 수 있도록 여유분을 받아옵니다.
const MAIN_PLAYROOM_FETCH_LIMIT = 10;

export const mainPlayroomListQueryKey = () =>
  ['playrooms', 'list', 'main'] as const;

/** 메인 상단에 노출할, 최근 개설된 라이브 플레이룸 3개를 조회합니다. */
export function useGetMainPlayrooms() {
  return useQuery({
    queryKey: mainPlayroomListQueryKey(),
    queryFn: () => getPlayrooms({ limit: MAIN_PLAYROOM_FETCH_LIMIT }),
    // 목록은 최신순으로 내려오므로 라이브만 남긴 뒤 앞에서 3개만 씁니다.
    select: (data) =>
      data.items
        .filter((playroom) => playroom.isLive)
        .slice(0, MAIN_PLAYROOM_COUNT),
  });
}
