import { apiClient } from '@/lib/http/client-fetch';
import type { CreatePlaylistRequest } from '@/services/playlist/playlist';

export const postPlaylist = (form: CreatePlaylistRequest) => {
  apiClient('/playlists', {
    method: 'POST',
    body: form,
  });
};
