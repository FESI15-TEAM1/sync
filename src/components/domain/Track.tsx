'use client';

import Image from 'next/image';

import defaultImage from '@/assets/images/default.png';

export default function Track({
  img,
  title,
  videoId,
  artist,
}: {
  img: string;
  title: string;
  videoId: string;
  artist: string;
}) {
  //videoId 로 해당 thumbnail 가져오는 기능 구현되어야됨
  return (
    <div className="flex items-center gap-4 p-2">
      <Image
        src={img ? img : defaultImage}
        alt={'thumbnail'}
        width={40}
        height={40}
        className="rounded-lg"
      />
      <div>
        <h3 className="text-text-primary">{title}</h3>
        <span className="text-text-secondary text-[12px]">{artist}</span>
      </div>
    </div>
  );
}
