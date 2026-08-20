'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useMyPlaylistsQuery } from '@/app/group/_hooks/useMyPlaylistsQuery';
import { useGroupQuery } from '@/app/group/[id]/_hooks/useGroupQuery';
import { useUserStore } from '@/providers/user-store-provider';

import EditPage from './_components/EditPage';
import { useAllGroupPlaylistsQuery } from './_hooks/useAllGroupPlaylistsQuery';

export default function EditGroupPage() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  const currentUser = useUserStore((state) => state.user);
  const isUserLoading = useUserStore((state) => state.isLoading);
  const router = useRouter();
  const groupQuery = useGroupQuery(id);
  const myPlaylistsQuery = useMyPlaylistsQuery(
    currentUser?.id,
    currentUser !== null,
  );
  const groupPlaylistsQuery = useAllGroupPlaylistsQuery(groupId);

  useEffect(() => {
    if (!isUserLoading && !currentUser) {
      router.replace('/login-required');
    }
  }, [isUserLoading, currentUser, router]);

  const isLoading =
    isUserLoading ||
    !currentUser ||
    groupQuery.isPending ||
    myPlaylistsQuery.isPending ||
    groupPlaylistsQuery.isPending;

  if (isLoading) {
    return (
      <p className="text-text-secondary mx-auto max-w-md px-5 py-10 text-center text-sm">
        불러오는 중입니다...
      </p>
    );
  }

  const group = groupQuery.data;

  if (
    groupQuery.isError ||
    myPlaylistsQuery.isError ||
    groupPlaylistsQuery.isError ||
    !group
  ) {
    return (
      <p
        role="alert"
        className="mx-auto max-w-md px-5 py-10 text-center text-sm text-red-500"
      >
        그룹 정보를 불러오는데 실패했습니다.
      </p>
    );
  }

  const groupPlaylists = groupPlaylistsQuery.data ?? [];

  // 그룹장은 편집 범위가 그룹 전체라 다른 멤버가 담은 항목까지 최종 목록에 포함해야
  // 유지된다(빠지면 제거됨). 참여자는 본인 것만 다루므로 잠글 필요가 없다.
  const isOwner = group.owner.userId === currentUser.id;
  const myGroupPlaylistIds = groupPlaylists
    .filter((playlist) => playlist.owner.userId === currentUser.id)
    .map((playlist) => playlist.id);
  const lockedPlaylistIds = isOwner
    ? groupPlaylists
        .filter((playlist) => playlist.owner.userId !== currentUser.id)
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
      playlists={myPlaylistsQuery.data ?? []}
      initialSelectedPlaylistIds={myGroupPlaylistIds}
      lockedPlaylistIds={lockedPlaylistIds}
    />
  );
}
