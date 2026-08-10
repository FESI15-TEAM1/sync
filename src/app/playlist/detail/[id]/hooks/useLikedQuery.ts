import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';
import {
  deleteLiked,
  getLikedPlaylist,
  putLiked,
} from '@/services/playlist/playlist.api';
import type { LikePlaylistResponse } from '@/services/playlist/playlistCard.type';

export const likedQueryKey = (playlistId: string) => ['playlists', playlistId];
export const likedPlaylistsQueryKey = ['users', 'me', 'liked-playlists'];

export function useLikedPlaylistsQuery(
  initialData: LikePlaylistResponse,
  enabled: boolean,
) {
  return useQuery({
    queryKey: likedPlaylistsQueryKey,
    queryFn: () => getLikedPlaylist(),
    initialData,
    enabled,
  });
}

export function useLikedMutation(playlistId: string) {
  const queryClient = useQueryClient();
  const queryKey = likedQueryKey(playlistId);

  return useMutation({
    mutationFn: (nextLiked: boolean) =>
      nextLiked ? putLiked(playlistId) : deleteLiked(playlistId),

    onMutate: async (nextLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey });

      const previousPlaylist =
        queryClient.getQueryData<PlaylistDetail>(queryKey);

      queryClient.setQueryData<PlaylistDetail>(queryKey, (old) =>
        old ? { ...old, isLiked: nextLiked } : old,
      );

      return { previousPlaylist };
    },

    onError: (_err, _nextLiked, context) => {
      if (context?.previousPlaylist !== undefined) {
        queryClient.setQueryData(queryKey, context.previousPlaylist);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: likedPlaylistsQueryKey });
    },
  });
}
