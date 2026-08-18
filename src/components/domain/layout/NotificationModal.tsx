'use client';

import Link from 'next/link';

import { useRecentUnreadNotificationsQuery } from '@/app/profile/[userId]/_hooks/useNotificationsQuery';
import NotificationItem from '@/components/NotificationItem';
import { useUserStore } from '@/providers/user-store-provider';

export default function NotificationModal() {
  const user = useUserStore((state) => state.user);
  const userId = user?.id ?? 0;

  const { data } = useRecentUnreadNotificationsQuery(userId, true);

  return (
    <div className="bg-bg-card border-border absolute top-full right-0 mt-2 flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border">
      {data?.items.length ? (
        <ul className="divide-border flex flex-col divide-y">
          {data.items.map((item) => (
            <NotificationItem key={item.id} item={item} userId={userId} />
          ))}
        </ul>
      ) : (
        <p className="text-text-secondary px-4 py-6 text-center text-sm">
          새 알림이 없습니다.
        </p>
      )}
      <Link
        href={`/profile/${userId}`}
        className="text-text-secondary hover:text-text-primary border-border border-t py-3 text-center text-sm font-bold transition-all"
      >
        자세히 보기
      </Link>
    </div>
  );
}
