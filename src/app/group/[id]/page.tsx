import { redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { GetGroupPlaylistsResponse } from '@/services/group/group.types';
import type {
  MyPlaylistItem,
  MyplaylistResponse,
} from '@/services/playlist/playlistCard.type';
import type { MyProfile } from '@/services/user/user.types';

import GroupDetail from './_components/GroupDetail';
import type { EditablePlaylist } from './_components/PlaylistEditModal';
import { notFound, redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { GroupDetailResponse } from '@/services/group/group.types';

import GroupDetail from './_components/GroupDetail';

// 스펙상 한 페이지 최대 개수. 커서로 끝까지 모아 전체 목록을 확보한다.
const PLAYLIST_PAGE_SIZE = '50';
const MAX_PLAYLIST_PAGES = 10;

async function getAllGroupPlaylists(groupId: number) {
  const items: GetGroupPlaylistsResponse['items'] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PLAYLIST_PAGES; page++) {
    const data: GetGroupPlaylistsResponse = await serverFetch<GetGroupPlaylistsResponse>(
      `/groups/${groupId}/playlists`,
      {
        method: 'GET',
        params: {
          limit: PLAYLIST_PAGE_SIZE,
          ...(cursor ? { cursor } : {}),
        },
      },
    );

    items.push(...data.items);

    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return items;
}

async function getAllMyPlaylists(userId: number) {
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

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId)) {
    notFound();
  }

  let group: GroupDetailResponse;
  try {
    group = await serverFetch<GroupDetailResponse>(`/groups/${groupId}`, {
      method: 'GET',
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 401) redirect('/login');
      if (error.status === 404) notFound();
      if (error.status === 403) {
        return (
          <p className="text-text-secondary mx-auto max-w-md px-5 py-10 text-center text-sm">
            비공개 그룹입니다.
          </p>
        );
      }
    }
    throw error;
  }

  let user: MyProfile;

  try {
    user = await serverFetch<MyProfile>('/users/me', { method: 'GET' });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) redirect('/login');
    throw error;
  }

  const [groupPlaylists, myPlaylists] = await Promise.all([
    getAllGroupPlaylists(groupId),
    getAllMyPlaylists(user.id),
  ]);

  const addedPlaylists: EditablePlaylist[] = groupPlaylists.map((item) => ({
    id: item.id,
    title: item.title,
    trackCount: item.trackCount,
    artist: item.owner.nickname,
  }));

  const addedIds = new Set(addedPlaylists.map((item) => item.id));

  // 이미 그룹에 담긴 것은 후보 목록에서 제외한다.
  const availablePlaylists: EditablePlaylist[] = myPlaylists
    .filter((item) => !addedIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      trackCount: item.trackCount,
      artist: user.nickname,
    }));

  return (
    <GroupDetail
      groupId={groupId}
      isLeader={isLeader}
      isJoined={isJoined}
      addedPlaylists={addedPlaylists}
      availablePlaylists={availablePlaylists}
    />
  );
}
