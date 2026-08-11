import { clientFetch } from '@/lib/http/client-fetch';

import type { NotificationItem } from './notifications.type';
import {
  type NotificationItemList,
  type responseNotificationsUnreadCountType,
} from './notifications.type';

export const getNotificationsUnread = () => {
  return clientFetch<responseNotificationsUnreadCountType>(
    `/notifications/unread-count`,
    {
      method: 'GET',
    },
  );
};
export const getNotifications = () => {
  return clientFetch<NotificationItemList>(`/notifications`, {
    method: 'GET',
  });
};

export const markNotificationRead = (notificationId: number) => {
  return clientFetch<NotificationItem>(`/notifications/${notificationId}`, {
    method: 'PATCH',
  });
};
