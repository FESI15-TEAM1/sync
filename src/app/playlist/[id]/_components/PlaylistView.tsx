'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useLikedPlaylistsQuery } from '@/app/playlist/detail/[id]/_hooks/useLikedQuery';
import BackButton from '@/components/common/BackButton';
import PlaylistCardList from '@/components/domain/playlists/PlaylistCardList';
import IconButton from '@/components/IconButton';
import Toggle from '@/components/Toggle';
import type {
  MyplaylistResponse,
  Playlist,
} from '@/services/playlist/playlistCard.type';
import type { UserProfile } from '@/services/user/user.types';

import {
  useUserPlaylistsQuery,
  useUserProfileQuery,
} from '../_hooks/useUserPlaylistsQuery';

type Tab = 'mine' | 'liked';

export default function PlaylistView({
  userId,
  initialMyData,
  likedData,
  initialProfile,
  isOwner,
}: {
  userId: string;
  initialMyData: MyplaylistResponse;
  likedData: Playlist[];
  initialProfile: UserProfile;
  isOwner: boolean;
}) {
  const [tab, setTab] = useState<Tab>('mine');
  const router = useRouter();

  const { data: profile } = useUserProfileQuery(userId, initialProfile);
  const { data: myPlaylists } = useUserPlaylistsQuery(userId, initialMyData);

  const { data: likedPlaylists } = useLikedPlaylistsQuery(
    { items: likedData, nextCursor: null },
    isOwner,
  );

  const activeTab = isOwner ? tab : 'mine';
  const items = activeTab === 'mine' ? myPlaylists.items : likedPlaylists.items;

  return (
    <div className="text-text-primary relative flex flex-col items-center justify-center gap-6 p-2">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex justify-center gap-6">
          <BackButton />
        </div>
      </div>
      <div className="ml-5 flex w-full items-center justify-between gap-3">
        <h3 className="text-xl font-bold">
          {profile.nickname} 님의 플레이리스트
        </h3>

        {isOwner && (
          <Toggle
            checked={activeTab === 'liked'}
            onChange={(checked) => setTab(checked ? 'liked' : 'mine')}
            checkedLabel="LIKED"
            uncheckedLabel="MINE"
            ariaLabel="플레이리스트 목록 전환"
          />
        )}
      </div>
      <div className="w-full">
        {items.length < 1 && (
          <div className="flex items-center justify-center">
            <span className="text-text-secondary">
              {activeTab === 'liked'
                ? '좋아요 한 플레이리스트가 없습니다.'
                : '플레이리스트가 없습니다.'}
            </span>
          </div>
        )}
        <PlaylistCardList data={items} />
      </div>
      <IconButton
        variants="primary"
        size="lg"
        className="fixed right-6 bottom-6 text-xl"
        onClick={() => router.push('/playlist/add')}
      >
        +
      </IconButton>
    </div>
  );
}
