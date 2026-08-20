'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useMyPlaylistsQuery } from '@/app/group/_hooks/useMyPlaylistsQuery';
import { useUserStore } from '@/providers/user-store-provider';

import AddPage from './_components/AddPage';

export default function AddGroupPage() {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);
  const isUserLoading = useUserStore((state) => state.isLoading);

  const myPlaylistsQuery = useMyPlaylistsQuery(
    currentUser?.id,
    currentUser !== null,
  );

  useEffect(() => {
    if (!isUserLoading && !currentUser) {
      router.replace('/login-required');
    }
  }, [isUserLoading, currentUser, router]);

  if (isUserLoading || !currentUser || myPlaylistsQuery.isPending) {
    return (
      <p className="text-text-secondary mx-auto max-w-md px-5 py-10 text-center text-sm">
        불러오는 중입니다...
      </p>
    );
  }

  if (myPlaylistsQuery.isError) {
    return (
      <p
        role="alert"
        className="mx-auto max-w-md px-5 py-10 text-center text-sm text-red-500"
      >
        플레이리스트를 불러오는데 실패했습니다.
      </p>
    );
  }

  return <AddPage playlists={myPlaylistsQuery.data ?? []} />;
}
