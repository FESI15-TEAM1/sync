import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import defaultImg from '@/assets/images/default.png';
import { formatTimeAgo } from '@/lib/formatITimeAgo';
import type { NotificationItem } from '@/services/notifications/notifications.type';

import {
  useDeleteNotification,
  useMarkNotificationRead,
} from '../_hooks/useNotificationsQuery';
function getNotificationContent(item: NotificationItem) {
  const name =
    item.actorCount > 1
      ? `${item.actor.nickname} 외 ${item.actorCount - 1}인`
      : item.actor.nickname;
  const subject = (
    <>
      <span className="font-bold">{name}</span>님이{' '}
    </>
  );

  switch (item.type) {
    case 'PLAYLIST_COMMENT':
      return {
        href: `/playlist/detail/${item.sourceId}`,
        subject,
        detail: (
          <>
            내 플레이리스트에 <span className="font-bold">댓글</span>을
            남겼습니다.
          </>
        ),
      };
    case 'PLAYLIST_LIKE':
      return {
        href: `/playlist/detail/${item.sourceId}`,
        subject,
        detail: (
          <>
            내 <span className="font-bold">플레이리스트를 좋아합니다.</span>
          </>
        ),
      };
    case 'FOLLOW':
      return {
        href: `/profile/${item.actor.userId}`,
        subject,
        detail: (
          <>
            나를 <span className="font-bold">팔로우 </span> 했습니다.
          </>
        ),
      };
    case 'FOLLOWED_LIVE':
      return {
        href: `/playroom/${item.sourceId}`,
        subject,
        detail: (
          <>
            <span className="font-bold">라이브</span>를 시작했습니다.
          </>
        ),
      };
    case 'GROUP_JOIN_REQUEST':
      return {
        href: `/group`,
        subject,
        detail: (
          <>
            내 <span className="font-bold">그룹 참여</span>를 요청했습니다.
          </>
        ),
      };
    case 'GROUP_CREATE_REQUEST':
      return {
        // sourceId는 요청의 근거가 된 playlist — 그룹은 아직 생성 전이라 그룹 목록으로 이동
        href: `/group`,
        subject,
        detail: (
          <>
            내 플레이리스트로 <span className="font-bold">그룹 생성</span>을
            요청했습니다.
          </>
        ),
      };
  }
}

export default function NotificationItem({
  item,
  userId,
}: {
  item: NotificationItem;
  userId: number;
}) {
  const { href, subject, detail } = getNotificationContent(item);
  const { mutate: markRead } = useMarkNotificationRead(userId);

  const { mutate: deleteNotification, isPending } = useDeleteNotification(
    item.id,
    userId,
  );

  const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotification();
  };
  return (
    <li className="group flex items-center gap-2">
      <Link
        href={href}
        className="flex flex-1 items-center gap-3 py-3 pr-2 pl-4"
        onClick={() => {
          if (!item.isRead) markRead(item.id);
        }}
      >
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
          <Image
            src={item.actor.image ? item.actor.image : defaultImg}
            alt="프로필이미지"
            fill={true}
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-text-primary text-sm leading-snug break-keep">
            {subject}
            {detail}
          </p>
          <p className="text-text-secondary mt-1 text-xs">
            {formatTimeAgo(item.createdAt)}
          </p>
        </div>

        {!item.isRead && (
          <span
            aria-hidden
            className="bg-primary size-2 shrink-0 rounded-full"
          />
        )}
      </Link>
      <button
        type="button"
        aria-label="알림 삭제"
        onClick={handleDelete}
        disabled={isPending}
        className={`text-text-primary mr-4 flex size-6 shrink-0 items-center justify-center rounded-full opacity-0 transition-all group-hover:opacity-100 ${
          isPending
            ? 'cursor-not-allowed bg-gray-400'
            : 'cursor-pointer bg-red-500'
        }`}
      >
        <span aria-hidden>×</span>
      </button>
    </li>
  );
}
