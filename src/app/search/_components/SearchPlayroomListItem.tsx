import Badge from '@/components/domain/playroom/Badge';
import type { SearchPlayroomItem } from '@/services/search/search.types';

export default function SearchPlayroomListItem({
  title,
  isLive,
  listenerCount,
}: Omit<SearchPlayroomItem, 'id'>) {
  return (
    <div className="bg-bg-card hover:border-border flex cursor-pointer flex-col gap-1 rounded-lg border-1 border-transparent p-4 transition-all hover:-translate-y-0.5 hover:shadow-xl">
      {isLive && (
        <div className="flex items-center justify-between">
          <Badge type="live" />

          <span className="flex items-center gap-1 text-xs text-white">
            <span className="relative flex">
              <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 transform animate-ping rounded-full bg-red-400"></span>
              <span className="size-1 rounded-full bg-red-500"></span>
            </span>
            {listenerCount}명 청취 중
          </span>
        </div>
      )}

      <h3 className="text-base font-bold text-white">{title}</h3>
    </div>
  );
}
