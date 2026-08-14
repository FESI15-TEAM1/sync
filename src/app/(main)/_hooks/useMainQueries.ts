import { useQuery } from '@tanstack/react-query';

import { getPublicPlaylists } from '@/services/playlist/playlist.api';

export function useGetPublicPlaylists() {
  return useQuery({
    queryKey: ['publicPlaylists'],
    queryFn: getPublicPlaylists,
  });
}
