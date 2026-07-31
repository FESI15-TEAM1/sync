import type { CreatePlaylistRequest } from '@/services/playlist/playlist';

import { apiClient } from '../../lib/http/client-fetch';

export const postPlaylist = (form: CreatePlaylistRequest) => {
  return apiClient(`/playlists`, { method: 'POST', body: form });
};
