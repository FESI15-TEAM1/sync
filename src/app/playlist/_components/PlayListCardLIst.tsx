import Link from 'next/link';

import type { PlaylistItem } from '@/app/playlist/page';
import PlaylistCard from '@/components/domain/PlaylistCard';

export default function PlaylistCardList({ data }: { data: PlaylistItem[] }) {
  return (
    <div className="grid grid-cols-2 items-center justify-items-center gap-1 md:grid-cols-4 lg:flex">
      {data.map((item) => {
        return (
          <Link href={`playlist/detail/${item.id}`} key={item.id}>
            <PlaylistCard title={item.title} trackCount={item.trackCount} />
          </Link>
        );
      })}
    </div>
  );
}
