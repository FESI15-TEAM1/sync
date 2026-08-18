'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';

import { APIError } from '@/lib/http/error';
import {
  deleteNotification,
  getNotifications,
  markNotificationRead,
  markNotificationReadAll,
} from '@/services/notifications/notifications.api';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  userId: (userId: number) => [...notificationQueryKeys.all, userId] as const,
  list: (userId: number) =>
    [...notificationQueryKeys.all, userId, 'list'] as const,
  recentUnread: (userId: number) =>
    [...notificationQueryKeys.all, userId, 'recentUnread'] as const,
  unReadCount: (userId: number) =>
    [...notificationQueryKeys.all, userId, 'unReadCount'] as const,
};

// Profile 페이지 전용 — 무한스크롤로 전체 알림을 커서 기반 페이지네이션한다.
export function useNotificationRequestQuery(userId: number, isOwn: boolean) {
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.list(userId),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getNotifications(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId && isOwn,
  });
}

const RECENT_UNREAD_LIMIT = 5;

// 알림 모달 전용 — 안읽은 알림 중 최신 5개만 select로 파생해 내려준다.
// 첫 페이지에 안읽은 알림이 5개 미만이면 5개를 채우거나 다음 페이지가 없을 때까지 이어서 가져온다.
export function useRecentUnreadNotificationsQuery(
  userId: number,
  isOwn: boolean,
) {
  const query = useInfiniteQuery({
    queryKey: notificationQueryKeys.recentUnread(userId),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getNotifications(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId && isOwn,
    // 모달은 열릴 때(마운트될 때)마다 최신 안읽은 알림을 다시 받아온다
    refetchOnMount: 'always',
    select: (data) => ({
      items: data.pages
        .flatMap((page) => page.items)
        .filter((item) => !item.isRead)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, RECENT_UNREAD_LIMIT),
    }),
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  const unreadCount = query.data?.items.length ?? 0;
  const needsMore =
    unreadCount < RECENT_UNREAD_LIMIT && hasNextPage && !isFetchingNextPage;

  useEffect(() => {
    if (needsMore) {
      fetchNextPage();
    }
  }, [needsMore, fetchNextPage]);

  return query;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) =>
      markNotificationRead(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
    },
    onError: (error) => {
      alert(
        error instanceof APIError ? error.message : '읽음 처리에 실패했습니다.',
      );
    },
  });
}
export function useMarkNotificationReadAll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markNotificationReadAll(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.all,
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
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.userId(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationQueryKeys.unReadCount(userId),
      });
    },
    onError: (error) => {
      alert(
        error instanceof APIError ? error.message : '삭제 처리를 실패했습니다.',
      );
    },
  });
}
