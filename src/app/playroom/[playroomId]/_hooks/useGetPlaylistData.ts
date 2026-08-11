import { skipToken, useQuery } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import { getPlayroomPlaylist } from '@/services/playroom/playroom.api';

/**
 * 방 상세의 playlistId 로 플레이리스트 상세를 가져옵니다.
 * playlistId 는 방 상세 조회가 끝나야 알 수 있으므로, 그 전에는 요청하지 않습니다.
 */
export function useGetPlaylistData(playlistId: number | undefined) {
  const {
    data: playlistData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['playlists', playlistId],
    queryFn:
      playlistId === undefined
        ? skipToken
        : () => getPlayroomPlaylist(playlistId),
  });

  const errorMessage = error
    ? error instanceof APIError
      ? error.message
      : '플레이리스트 정보를 가져오는 중 오류가 발생했습니다.'
    : null;

  return { playlistData, errorMessage, isLoading };
}
