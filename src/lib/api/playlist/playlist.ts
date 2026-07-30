import type { CreatePlaylistRequest } from '@/types/playlist';

import { apiClient } from '../client';

export const postPlaylist = (form: CreatePlaylistRequest) => {
  return apiClient(`/playlists`, { method: 'POST', body: form });
};
