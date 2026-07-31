'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import BackButton from '@/components/common/BackButton';
import IconButton from '@/components/IconButton';
import type {
  MyPlaylistItem,
  Playlist,
} from '@/services/playlist/playlistCard.type';

import PlaylistCardList from '../../_components/PlayListCardLIst';

type Tab = 'mine' | 'liked';

export default function PlaylistView({
  myData,
  likedData,
}: {
  myData: MyPlaylistItem[];
  likedData: Playlist[];
}) {
  const [tab, setTab] = useState<Tab>('mine');
  const router = useRouter();

  const items = tab === 'mine' ? myData : likedData;

  return (
    <div className="text-text-primary relative flex flex-col items-center justify-center p-2">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex justify-center gap-6">
          <BackButton />
          <span>유저닉네임</span>
        </div>

        <div className="flex items-center gap-3"></div>
      </div>
      <div className="relative mt-4 flex justify-center">
        <div className="absolute flex w-full justify-between">
          <button
            type="button"
            onClick={() => setTab('mine')}
            className={clsx(
              'm-auto text-2xl font-bold transition-colors',
              tab === 'mine' ? 'text-text-primary' : 'text-text-secondary',
            )}
          >
            MINE
          </button>
          <span className="text-text-secondary text-2xl">|</span>
          <button
            type="button"
            onClick={() => setTab('liked')}
            className={clsx(
              'm-auto text-2xl font-bold transition-colors',
              tab === 'liked' ? 'text-text-primary' : 'text-text-secondary',
            )}
          >
            LIKED
          </button>
        </div>
        <div className="mt-20 lg:w-4xl">
          <PlaylistCardList data={items} />
        </div>
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
