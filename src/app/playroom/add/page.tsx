import { redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  MyPlaylistItem,
  MyplaylistResponse,
} from '@/services/playlist/playlistCard.type';
import type { MyProfile } from '@/services/user/user.types';

import AddForm from './_components/AddForm';

// 스펙상 한 페이지 최대 개수. 커서로 끝까지 모아 모든 플레이리스트를 선택할 수 있게 한다.
const PLAYLIST_PAGE_SIZE = '50';
const MAX_PLAYLIST_PAGES = 10;

async function getMyPlaylists(userId: number) {
  const playlists: MyPlaylistItem[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PLAYLIST_PAGES; page++) {
    const data: MyplaylistResponse = await serverFetch<MyplaylistResponse>(
      `/users/${userId}/playlists`,
      {
        method: 'GET',
        params: {
          limit: PLAYLIST_PAGE_SIZE,
          ...(cursor ? { cursor } : {}),
        },
      },
    );

    playlists.push(...data.items);

    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return playlists;
}

export default async function AddPlayroom() {
  let user: MyProfile;

  try {
    user = await serverFetch<MyProfile>('/users/me', { method: 'GET' });
  } catch (error) {
    if (error instanceof APIError) redirect('/login');
    throw error;
  }

  const playlists = await getMyPlaylists(user.id);

  return <AddForm playlists={playlists} />;
}
