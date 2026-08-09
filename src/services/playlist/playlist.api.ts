import { clientFetch } from '@/lib/http/client-fetch';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';
import type {
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
} from '@/services/playlist/playlist';

export const postPlaylist = (form: CreatePlaylistRequest) => {
  return clientFetch('/playlists', {
    method: 'POST',
    body: form,
  });
};

export const updatePlaylist = (
  id: number | string,
  form: UpdatePlaylistRequest,
) => {
  return clientFetch<PlaylistDetail>(`/playlists/${id}`, {
    method: 'PUT',
    body: form,
  });
};
export const deletePlaylist = (id: number | string) => {
  return clientFetch(`/playlists/${id}`, {
    method: 'DELETE',
  });
};
export const postComments = (
  id: number | string,
  content: { content: string },
) => {
  return clientFetch(`/playlists/${id}/comments`, {
    method: 'POST',
    body: content,
  });
};
export const updateComment = (
  id: number | string,
  commentId: number | string,
  content: { content: string },
) => {
  return clientFetch(`/playlists/${id}/comments/${commentId}`, {
    method: 'PATCH',
    body: content,
  });
};
