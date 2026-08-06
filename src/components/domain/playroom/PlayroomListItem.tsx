import type { PlayroomCardData } from '@/services/playroom/playroom.types';

import Badge from './Badge';

export default function PlayroomListItem({
  title,
  description,
  hashtags,
  listenerCount,
  host,
}: Omit<PlayroomCardData, 'id'>) {
  return (
    <div className="bg-bg-card hover:border-border flex cursor-pointer flex-col gap-0.5 rounded-lg border-1 border-transparent p-4 transition-all hover:-translate-y-0.5 hover:shadow-xl">
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

      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-text-secondary text-xs">{description}</p>
      </div>

      <div className="mt-1 flex items-end justify-between">
        <ul className="flex flex-wrap gap-1">
          {hashtags.map((hashtag) => (
            <li key={hashtag}>
              <Badge type="genre">{hashtag}</Badge>
            </li>
          ))}
        </ul>

        <span className="text-text-secondary text-sm">
          {host.nickname}님의 라이브
        </span>
      </div>
    </div>
  );
}
