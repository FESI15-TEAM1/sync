import { useQuery } from '@tanstack/react-query';

import { getUserPlaylists } from '@/services/playlist/playlist.api';
import type { MyplaylistResponse } from '@/services/playlist/playlistCard.type';
import { getUser } from '@/services/user/user.api';
import type { UserProfile } from '@/services/user/user.types';

export const userPlaylistsQueryKey = (userId: string) =>
  ['users', userId, 'playlists'] as const;

export const userProfileQueryKey = (userId: string) =>
  ['users', userId] as const;

export function useUserPlaylistsQuery(
  userId: string,
  initialData: MyplaylistResponse,
) {
  return useQuery({
    queryKey: userPlaylistsQueryKey(userId),
    queryFn: () => getUserPlaylists(Number(userId)),
    initialData,
  });
}

export function useUserProfileQuery(userId: string, initialData: UserProfile) {
  return useQuery({
    queryKey: userProfileQueryKey(userId),
    queryFn: () => getUser(Number(userId)),
    initialData,
  });
}
