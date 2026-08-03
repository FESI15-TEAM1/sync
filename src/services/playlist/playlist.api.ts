import type { CreatePlaylistRequest } from '@/services/playlist/playlist';

export const postPlaylist = async (form: CreatePlaylistRequest) => {
  await fetch('/api/playlists', {
    method: 'POST',
    body: JSON.stringify(form),
  });
};
