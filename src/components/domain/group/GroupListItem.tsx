import Image from 'next/image';

import type { GroupSummary } from '@/services/group/group.types';
import { getGroupGradientClassName } from '@/services/group/group.utils';

export default function GroupListItem({
  id,
  title,
  image,
  memberCount,
  playlistCount,
}: GroupSummary) {
  return (
    <div className="bg-bg-card hover:bg-input flex items-center gap-4 rounded-2xl p-3 transition-colors">
      {image ? (
        <Image
          src={image}
          alt="그룹 커버"
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div
          aria-hidden
          className={`size-14 shrink-0 rounded-xl bg-linear-to-br ${getGroupGradientClassName(id)}`}
        />
      )}
      <div className="min-w-0">
        <h3 className="text-text-primary truncate text-base font-semibold">
          {title}
        </h3>
        <p className="text-text-secondary mt-0.5 text-sm">
          멤버 {memberCount}명 · 플레이리스트 {playlistCount}개
        </p>
      </div>
    </div>
  );
}
