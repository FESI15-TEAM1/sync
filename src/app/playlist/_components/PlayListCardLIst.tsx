import type { PlaylistItem } from '@/app/playlist/page';
import PlaylistCard from '@/components/domain/PlaylistCard';

export default function PlaylistCardList({ data }: { data: PlaylistItem[] }) {
  return (
    <div className="grid grid-cols-2 items-center justify-items-center gap-1 md:grid-cols-4 lg:flex">
      {data.map((item) => {
        return (
          <PlaylistCard
            key={item.id}
            title={item.title}
            trackCount={item.trackCount}
          />
        );
      })}
    </div>
  );
}
