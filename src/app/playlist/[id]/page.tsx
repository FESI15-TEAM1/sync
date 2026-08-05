import { serverFetch } from '@/lib/http/server-fetch';
import type {
  LikePlaylistResponse,
  MyplaylistResponse,
} from '@/services/playlist/playlistCard.type';

import PlaylistView from './_components/PlaylistView';

export default async function Playlist({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const initalData = await serverFetch<MyplaylistResponse>(
    `/users/${(await params).id}/playlists`,
    {
      method: 'GET',
    },
  );

  const initalLikeData = await serverFetch<LikePlaylistResponse>(
    `/users/me/liked-playlists`,
    {
      method: 'GET',
    },
  );
  const userNickname = await serverFetch<{ id: number; nickname: string }>(
    `/users/${(await params).id}`,
    {
      method: 'GET',
    },
  );

  return (
    <div>
      <PlaylistView
        myData={initalData.items}
        likedData={initalLikeData.items}
        userNickname={userNickname.nickname}
      />
    </div>
  );
}
