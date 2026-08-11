'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import Bell from '@/assets/icons/bell.svg';
import { useUserStore } from '@/providers/user-store-provider';
import { getNotificationsUnread } from '@/services/notifications/notifications.api';

export default function NotificationBell() {
  const { data } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getNotificationsUnread,
    refetchInterval: 30000,
  });
  const user = useUserStore((state) => state.user);

  const unreadCount = data?.count;

  return (
    <>
      {user && (
        <Link href={`/profile/${user.id}`} className="relative">
          <Bell width={30} height={30} color={'white'} />
          {unreadCount !== undefined && unreadCount > 0 ? (
            <div className="absolute top-0 right-0.5 size-3 rounded-full bg-red-500"></div>
          ) : (
            ''
          )}
        </Link>
      )}
    </>
  );
}
