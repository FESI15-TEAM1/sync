import { clsx } from 'clsx';

import type { SearchPlayroomItem } from '@/services/search/search.types';

export default function SearchPlayroomListItem({
  title,
  isLive,
  listenerCount,
}: Omit<SearchPlayroomItem, 'id'>) {
  return (
    <div className="bg-bg-card hover:border-border flex cursor-pointer flex-col gap-5 rounded-lg border border-transparent p-4 transition-all hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <span
          className={clsx('rounded-full px-3 py-0.2 text-xs font-semibold', {
            'bg-[rgba(241,109,109,20%)] text-[#f16d6d]': isLive,
            'bg-disabled/20 text-disabled': !isLive,
          })}
        >
          LIVE
        </span>

        <span
          className={clsx('flex items-center gap-1 text-xs', {
            'text-white': isLive,
            'text-text-secondary': !isLive,
          })}
        >
          <span className="relative flex">
            {isLive && (
              <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 transform animate-ping rounded-full bg-red-400"></span>
            )}
            <span
              className={clsx('size-1 rounded-full', {
                'bg-red-500': isLive,
                'bg-disabled': !isLive,
              })}
            ></span>
          </span>
          {listenerCount}명 청취 중
        </span>
      </div>

      <h3 className="text-base font-bold text-white">{title}</h3>
    </div>
  );
}
