import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent } from 'react';

import {
  useDeleteNotification,
  useMarkNotificationRead,
} from '@/app/profile/[userId]/_hooks/useNotificationsQuery';
import defaultImg from '@/assets/images/default.png';
import { formatTimeAgo } from '@/lib/formatITimeAgo';
import type { NotificationItem } from '@/services/notifications/notifications.type';
// "내 그룹 '이름'"처럼 리소스 종류 + 이름을 함께 보여줌. 이름이 없으면(리소스 삭제 등) 종류만 남김
// mine이 false면 "내"를 붙이지 않음 — 처리 결과 알림(수락/거절)은 내 소유가 아닌 리소스를 가리킴
function mySource(label: string, sourceName: string | null, mine = true) {
  return (
    <>
      {mine ? `내 ${label}` : label}
      {sourceName && (
        <>
          {' '}
          <span className="font-bold">&apos;{sourceName}&apos;</span>
        </>
      )}
    </>
  );
}

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
            {mySource('플레이리스트', item.sourceName)}에{' '}
            <span className="font-bold">댓글</span>을 남겼습니다.
          </>
        ),
      };
    case 'PLAYLIST_LIKE':
      return {
        href: `/playlist/detail/${item.sourceId}`,
        subject,
        detail: (
          <>
            {mySource('플레이리스트', item.sourceName)}에{' '}
            <span className="font-bold">좋아요</span>를 눌렀습니다.
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
            {mySource('그룹', item.sourceName)}{' '}
            <span className="font-bold">참여</span>를 요청했습니다.
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
            {mySource('플레이리스트', item.sourceName)}에서{' '}
            <span className="font-bold">그룹 생성</span>을 요청했습니다.
          </>
        ),
      };
    case 'GROUP_JOIN_ACCEPTED':
      return {
        href: `/group/${item.sourceId}`,
        subject,
        detail: (
          <>
            {mySource('그룹', item.sourceName, false)} 참여 요청을{' '}
            <span className="font-bold">수락</span>했습니다.
          </>
        ),
      };
    case 'GROUP_JOIN_REJECTED':
      return {
        href: `/group`,
        subject,
        detail: (
          <>
            {mySource('그룹', item.sourceName, false)} 참여 요청을{' '}
            <span className="font-bold">거절</span>했습니다.
          </>
        ),
      };
    case 'GROUP_CREATE_ACCEPTED':
      return {
        // sourceId는 새로 만들어진 그룹
        href: `/group/${item.sourceId}`,
        subject,
        detail: (
          <>
            {mySource('그룹', item.sourceName, false)} 생성 요청을{' '}
            <span className="font-bold">수락</span>했습니다.
          </>
        ),
      };
    case 'GROUP_CREATE_REJECTED':
      return {
        // 그룹이 생성되지 않아 상세로 보낼 곳이 없음 — 목록으로 이동
        href: `/group`,
        subject,
        detail: (
          <>
            {mySource('플레이리스트', item.sourceName, false)}에서 요청한 그룹
            생성이 <span className="font-bold">거절</span>되었습니다.
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
  const { mutate: markRead } = useMarkNotificationRead();

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

        <div className="min-w-0 flex-1 text-left">
          <p className="text-text-primary line-clamp-2 text-sm leading-snug break-keep">
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
        className={`text-text-primary hover:border-text-primary mr-4 flex size-6 shrink-0 items-center justify-center rounded-full opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2${
          isPending
            ? 'cursor-not-allowed bg-gray-400'
            : 'border-disabled cursor-pointer border-2'
        }`}
      >
        <span aria-hidden>×</span>
      </button>
    </li>
  );
}
