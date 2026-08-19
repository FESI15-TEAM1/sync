import Image from 'next/image';

import type { SearchGroupItem } from '@/services/search/search.types';

export default function SearchGroupListItem({
  title,
  memberCount,
  image,
}: SearchGroupItem) {
  return (
    <div className="bg-bg-card hover:bg-input flex items-center gap-4 rounded-2xl p-3 transition-all hover:-translate-y-0.5 hover:shadow-xl">
      <Image
        src={image}
        alt="그룹 이미지"
        width={56}
        height={56}
        className={'size-14 shrink-0 rounded-xl bg-linear-to-br'}
      />
      <div className="min-w-0">
        <h3 className="text-text-primary truncate text-base font-semibold">
          {title}
        </h3>
        <p className="text-text-secondary mt-0.5 text-sm">
          멤버 {memberCount}명
        </p>
      </div>
    </div>
  );
}
