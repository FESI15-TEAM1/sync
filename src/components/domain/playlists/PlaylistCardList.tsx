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
    <div className="grid grid-cols-2 items-center justify-items-center gap-1 md:grid-cols-4 lg:flex lg:flex-wrap">
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
