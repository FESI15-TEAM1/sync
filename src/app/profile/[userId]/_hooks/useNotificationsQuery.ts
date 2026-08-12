'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import {
  getNotifications,
  markNotificationRead,
  markNotificationReadAll,
} from '@/services/notifications/notifications.api';

export function useNotificationRequestQuery(userId: number, isOwn: boolean) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(),
    enabled: !!userId && isOwn,
  });
}

export function useMarkNotificationRead(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationRead(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count', userId],
      });
    },
    onError: (error) => {
      alert(
        error instanceof APIError ? error.message : '읽음 처리에 실패했습니다.',
      );
    },
  });
}
export function useMarkNotificationRealAll(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markNotificationReadAll(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count', userId],
      });
    },
    onError: (error) => {
      alert(
        error instanceof APIError ? error.message : '읽음 처리에 실패했습니다.',
      );
    },
  });
}
