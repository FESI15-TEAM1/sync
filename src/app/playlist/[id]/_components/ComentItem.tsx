import Image from 'next/image';

import type { ComentItemType } from './ComentItemList';

export default function ComentItem({ coment }: { coment: ComentItemType }) {
  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return date.toLocaleDateString('ko-KR');
  }
  return (
    <div className="text-text-primary flex items-center gap-3">
      <div className='rounded-full" relative size-8 shrink-0 overflow-hidden'>
        <Image
          src={coment.author.image}
          alt="프로필"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <div className="flex gap-5 text-start">
          <span className="text-sm">{coment.author.nickname}</span>
          <span className="text-text-secondary text-sm">
            {formatTimeAgo(coment.createdAt)}
          </span>
        </div>
        <span className="text-sm">{coment.content}</span>
      </div>
    </div>
  );
}
