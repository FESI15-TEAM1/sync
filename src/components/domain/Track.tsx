'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

import defaultImage from '@/assets/images/default.png';

export default function Track({
  img,
  title,
  videoId,
  artist,
  Button,
  onClick,
}: {
  img?: string;
  title: string;
  videoId: string;
  artist: string;
  Button?: ReactNode;
  onClick?: () => void;
}) {
  //videoId 로 해당 thumbnail 가져오는 기능 구현되어야됨
  return (
    <div
      className="flex items-center justify-between gap-4 p-2"
      id={videoId}
      onClick={onClick}
    >
      <Image
        src={img ? img : defaultImage}
        alt={'thumbnail'}
        width={40}
        height={40}
        className="flex-none rounded-lg"
      />
      <div className="grow">
        <h3 className="text-text-primary">{title}</h3>
        <span className="text-text-secondary text-[12px]">{artist}</span>
      </div>
      {Button}
    </div>
  );
}
