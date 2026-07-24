import Image from 'next/image';

import mookImage from '../../assets/images/mook.jpg';

export default function PlaylistCard({
  img,
  title,
  trackCount,
}: {
  img?: string;
  title: string;
  trackCount: number;
}) {
  return (
    <div className="bg-bg-card text-text-primary hover:-translate-y- flex max-w-42.5 flex-col gap-2 rounded-2xl px-3 py-5 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-2xl">
      <Image
        className="rounded-2xl"
        src={img ? img : mookImage}
        alt="플레이리스트 대표 이미지"
        width={150}
        height={150}
      />
      <div className="items-baseline">
        <h3>{title}</h3>

        <span title={title} className="text-sm text-ellipsis">
          {trackCount}곡
        </span>
      </div>
    </div>
  );
}
