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

// TODO: 실제 API 연동 시 로그인 세션(쿠키/토큰)과 groupId로 서버에서 멤버십을
// 조회하는 호출로 교체한다. isLeader/isJoined는 클라이언트가 보낸 값(쿼리 등)을
// 절대 신뢰하지 말고, 매 요청마다 서버에서 재검증해야 한다.
async function getViewerMembership(
  groupId: number,
  devOverride?: { role?: string; joined?: string },
) {
  if (process.env.NODE_ENV !== 'production' && devOverride) {
    return {
      isLeader: devOverride.role === 'leader',
      isJoined: devOverride.joined !== 'false',
    };
  }

  // mock: 실제로는 그룹 상세 조회 응답에서 파생되어야 한다.
  return { isLeader: false, isJoined: true };
}

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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string; joined?: string }>;
}) {
  const { id } = await params;
  const groupId = Number(id);
  const devOverride = await searchParams;

  const { isLeader, isJoined } = await getViewerMembership(
    groupId,
    devOverride,
  );

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
