'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import {
  getNotifications,
  markNotificationRead,
} from '@/services/notifications/notifications.api';

export function useNotificationRequestQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationRead(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count'],
      });
    },
    onError: (error) => {
      alert(
        error instanceof APIError ? error.message : '읽음 처리에 실패했습니다.',
      );
    },
  });
}
