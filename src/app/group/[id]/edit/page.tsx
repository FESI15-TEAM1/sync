import { redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  GetGroupPlaylistsResponse,
  GroupDetailResponse,
  GroupPlaylistItem,
} from '@/services/group/group.types';
import type {
  MyPlaylistItem,
  MyplaylistResponse,
} from '@/services/playlist/playlistCard.type';
import type { MyProfile } from '@/services/user/user.types';

import EditPage from './_components/EditPage';

// 스펙상 한 페이지 최대 개수. 커서로 끝까지 모아 전체 목록을 확보한다.
const PAGE_SIZE = '50';
const MAX_PAGES = 10;

async function getMyPlaylists(userId: number) {
  const playlists: MyPlaylistItem[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const data: MyplaylistResponse = await serverFetch<MyplaylistResponse>(
      `/users/${userId}/playlists`,
      {
        method: 'GET',
        params: {
          limit: PAGE_SIZE,
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

async function getGroupPlaylists(groupId: string) {
  const playlists: GroupPlaylistItem[] = [];
  let cursor: string | null = null;

  for (let page = 0; page < MAX_PAGES; page++) {
    const data: GetGroupPlaylistsResponse =
      await serverFetch<GetGroupPlaylistsResponse>(
        `/groups/${groupId}/playlists`,
        {
          method: 'GET',
          params: {
            limit: PAGE_SIZE,
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

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let user: MyProfile;
  let group: GroupDetailResponse;

  try {
    user = await serverFetch<MyProfile>('/users/me', { method: 'GET' });
    group = await serverFetch<GroupDetailResponse>(`/groups/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) redirect('/login');
    throw error;
  }

  const [myPlaylists, groupPlaylists] = await Promise.all([
    getMyPlaylists(user.id),
    getGroupPlaylists(id),
  ]);

  // 그룹장은 편집 범위가 그룹 전체라 다른 멤버가 담은 항목까지 최종 목록에 포함해야
  // 유지된다(빠지면 제거됨). 참여자는 본인 것만 다루므로 잠글 필요가 없다.
  const isOwner = group.owner.userId === user.id;
  const myGroupPlaylistIds = groupPlaylists
    .filter((playlist) => playlist.owner.userId === user.id)
    .map((playlist) => playlist.id);
  const lockedPlaylistIds = isOwner
    ? groupPlaylists
        .filter((playlist) => playlist.owner.userId !== user.id)
        .map((playlist) => playlist.id)
    : [];

  return (
    <EditPage
      groupId={id}
      initialGroup={{
        title: group.title,
        description: group.description,
        image: group.image,
        isPublic: group.isPublic,
      }}
      playlists={myPlaylists}
      initialSelectedPlaylistIds={myGroupPlaylistIds}
      lockedPlaylistIds={lockedPlaylistIds}
    />
  );
}
