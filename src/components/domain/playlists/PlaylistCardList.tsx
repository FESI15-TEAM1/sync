'use client';

import Link from 'next/link';

import PlaylistCard from '@/components/domain/PlaylistCard';
import type {
  MyPlaylistItem,
  Playlist,
} from '@/services/playlist/playlistCard.type';

export default function PlaylistCardList({
  data,
}: {
  data: MyPlaylistItem[] | Playlist[];
}) {
  return (
    <div className="grid grid-cols-[repeat(2,max-content)] items-center justify-center gap-4 sm:flex sm:flex-wrap sm:justify-start">
      {data.map((item) => {
        return (
          <Link href={`/playlist/detail/${item.id}`} key={item.id}>
            <PlaylistCard
              title={item.title}
              trackCount={item.trackCount}
              img={item.image}
            />
          </Link>
        );
      })}
    </div>
  );
}
