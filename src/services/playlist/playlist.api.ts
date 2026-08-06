import { clientFetch } from '@/lib/http/client-fetch';
import type { CreatePlaylistRequest } from '@/services/playlist/playlist';

export const postPlaylist = (form: CreatePlaylistRequest) => {
  return clientFetch('/playlists', {
    method: 'POST',
    body: form,
  });
};
