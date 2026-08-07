import Image from 'next/image';

import type { CommentItemType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import defaultImage from '@/assets/images/default.png';

export default function CommentItem({
  comment,
  userid,
}: {
  comment: CommentItemType;
  userid: string | number | null;
}) {
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
  console.log(userid);

  return (
    <div className="text-text-primary relative flex items-center gap-3">
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
        <Image
          src={comment.author.image || defaultImage}
          alt="프로필"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <div className="flex gap-5 text-start">
          <span className="text-sm">{comment.author.nickname}</span>
          <span className="text-text-secondary text-sm">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        <span className="text-sm">{comment.content}</span>
      </div>
      {userid === comment.author.userId && (
        <button className="text-text-secondary absolute right-0 cursor-pointer text-[12px]">
          수정
        </button>
      )}
    </div>
  );
}
