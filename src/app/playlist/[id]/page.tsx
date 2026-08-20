import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  LikePlaylistResponse,
  MyplaylistResponse,
} from '@/services/playlist/playlistCard.type';
import type { UserProfile } from '@/services/user/user.types';

import PlaylistView from './_components/PlaylistView';

export default async function Playlist({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const routeUserId = (await params).id;

  const initialMyData = await serverFetch<MyplaylistResponse>(
    `/users/${routeUserId}/playlists`,
    {
      method: 'GET',
    },
  );

  const initialProfile = await serverFetch<UserProfile>(
    `/users/${routeUserId}`,
    {
      method: 'GET',
    },
  );

  const currentUserId = await getCurrentUserId();

  const isOwner = currentUserId === Number(routeUserId);

  const initialLikeData = isOwner
    ? await serverFetch<LikePlaylistResponse>(`/users/me/liked-playlists`, {
        method: 'GET',
      })
    : null;

  return (
    <div>
      <PlaylistView
        userId={routeUserId}
        initialMyData={initialMyData}
        likedData={initialLikeData?.items ?? []}
        initialProfile={initialProfile}
        isOwner={isOwner}
      />
    </div>
  );
}

async function getCurrentUserId() {
  try {
    const me = await serverFetch<{ id: number }>('/users/me', {
      method: 'GET',
    });
    return me.id;
  } catch (error) {
    if (error instanceof APIError) return null;
    throw error;
  }
}
