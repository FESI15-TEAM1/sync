'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import {
  deleteNotification,
  getNotifications,
  markNotificationRead,
  markNotificationReadAll,
} from '@/services/notifications/notifications.api';

// Profile 페이지 전용 — 무한스크롤로 전체 알림을 커서 기반 페이지네이션한다.
export function useNotificationRequestQuery(userId: number, isOwn: boolean) {
  return useInfiniteQuery({
    queryKey: ['notifications', userId, 'list'],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getNotifications(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId && isOwn,
  });
}

// 알림 모달 전용 — 안읽은 알림 중 최신 5개만 select로 파생해 내려준다.
export function useRecentUnreadNotificationsQuery(
  userId: number,
  isOwn: boolean,
) {
  return useQuery({
    queryKey: ['notifications', userId, 'recent-unread'],
    queryFn: () => getNotifications(),
    enabled: !!userId && isOwn,
    // 모달은 열릴 때(마운트될 때)마다 최신 안읽은 알림을 다시 받아온다
    refetchOnMount: 'always',
    select: (data) => ({
      ...data,
      items: [...data.items]
        .filter((item) => !item.isRead)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    }),
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
export function useMarkNotificationReadAll(userId: number) {
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

export function useDeleteNotification(notificationId: number, userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteNotification(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({
        queryKey: ['notifications', 'unread-count', userId],
      });
    },
    onError: (error) => {
      alert(
        error instanceof APIError ? error.message : '삭제 처리를 실패했습니다.',
      );
    },
  });
}
