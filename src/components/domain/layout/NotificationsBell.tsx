'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import Bell from '@/assets/icons/bell.svg';
import { useUserStore } from '@/providers/user-store-provider';
import { getNotificationsUnread } from '@/services/notifications/notifications.api';

import NotificationModal from './NotificationModal';

export default function NotificationBell() {
  const user = useUserStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ['notifications', 'unread-count', user?.id],
    queryFn: getNotificationsUnread,
    refetchInterval: 30000,
    enabled: !!user,
  });

  const unreadCount = data?.count;

  useEffect(() => {
    if (!isModalOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {user && (
        <button
          type="button"
          aria-label="알림"
          aria-expanded={isModalOpen}
          className="relative"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          <Bell width={30} height={30} color={'white'} />
          {unreadCount !== undefined && unreadCount > 0 ? (
            <div className="absolute top-0 right-0.5 size-3 rounded-full bg-red-500"></div>
          ) : (
            ''
          )}
        </button>
      )}
      {isModalOpen ? <NotificationModal /> : null}
    </div>
  );
}
