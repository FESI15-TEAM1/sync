import Image from 'next/image';
import type { ReactNode } from 'react';

import mookImage from '../../assets/images/default.png';

export default function PlaylistCard({
  img,
  title,
  trackCount,
  buttonChild,
}: {
  img?: string;
  title: string;
  trackCount?: number;
  buttonChild?: ReactNode;
}) {
  return (
    <div className="bg-bg-card text-text-primary flex h-57.5 w-42.5 flex-col gap-2 rounded-2xl px-3 py-5 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-2xl">
      <div className="flex justify-center">
        <Image
          className="aspect-square rounded-2xl object-cover select-none"
          src={img ? img : mookImage}
          alt="플레이리스트 대표 이미지"
          width={140}
          height={140}
          draggable={false}
        />
      </div>
      <div className="items-baseline">
        <h4 className="truncate text-base" title={title}>
          {title}
        </h4>
        <div className="flex justify-between">
          {trackCount !== undefined && (
            <span className="text-sm">{trackCount}곡</span>
          )}
          {buttonChild}
        </div>
      </div>
    </div>
  );
}
