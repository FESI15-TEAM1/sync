import { clientFetch } from '@/lib/http/client-fetch';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';
import type {
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
} from '@/services/playlist/playlist';
import type { LikePlaylistResponse } from '@/services/playlist/playlistCard.type';

export const postPlaylist = (form: CreatePlaylistRequest) => {
  return clientFetch('/playlists', {
    method: 'POST',
    body: form,
  });
};

// 유저의 플레이리스트 목록
export const getUserPlaylists = (
  userId: number,
  { cursor, limit }: GetUserPlaylistsParams = {},
) => {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<MyplaylistResponse>(`/users/${userId}/playlists`, {
    method: 'GET',
    params: Object.keys(params).length > 0 ? params : undefined,
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
export const deleteComment = (
  id: number | string,
  commentId: number | string,
) => {
  return clientFetch(`/playlists/${id}/comments/${commentId}`, {
    method: 'DELETE',
  });
};
export const putLiked = (playlistId: string) => {
  return clientFetch(`/playlists/${playlistId}/like`, {
    method: 'PUT',
  });
};
export const deleteLiked = (playlistId: string) => {
  return clientFetch(`/playlists/${playlistId}/like`, {
    method: 'DELETE',
  });
};
export const getLikedPlaylist = () => {
  return clientFetch<LikePlaylistResponse>('/users/me/liked-playlists');
};
