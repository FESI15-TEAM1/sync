import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import { clientFetch } from '@/lib/http/client-fetch';
import { APIError } from '@/lib/http/error';
import {
  deleteComment,
  postComments,
  updateComment,
} from '@/services/playlist/playlist.api';

export const commentsQueryKey = (playlistId: string) =>
  ['playlists', playlistId, 'comments'] as const;

export function useCommentsQuery(playlistId: string) {
  return useInfiniteQuery({
    queryKey: commentsQueryKey(playlistId),
    queryFn: ({ pageParam }) =>
      clientFetch<CommentItemsType>(`/playlists/${playlistId}/comments`, {
        params: pageParam ? { cursor: pageParam } : undefined,
      }),
    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage, _allPages, _lastPageParam, allPageParams) => {
      const next = lastPage.nextCursor || undefined;
      if (next === undefined || allPageParams.includes(next)) return undefined;
      return next;
    },
  });
}

function updateCommentInCache(
  old: InfiniteData<CommentItemsType> | undefined,
  commentId: number,
  content: string,
) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.id === commentId ? { ...item, content } : item,
      ),
    })),
  };
}

function removeCommentFromCache(
  old: InfiniteData<CommentItemsType> | undefined,
  commentId: number,
) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      items: page.items.filter((item) => item.id !== commentId),
    })),
  };
}
export function useAddCommentMutation(playlistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      postComments(Number(playlistId), { content: content.trim() }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(playlistId) });
    },
    onError: (error) => {
      alert(
        error instanceof APIError
          ? error.message
          : '댓글을 작성하는 중 오류가 발생했습니다.',
      );
    },
  });
}
export function useEditCommentMutation(playlistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) => updateComment(Number(playlistId), commentId, { content }),
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({
        queryKey: commentsQueryKey(playlistId),
      });
      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentItemsType>
      >(commentsQueryKey(playlistId));

      queryClient.setQueryData<InfiniteData<CommentItemsType>>(
        commentsQueryKey(playlistId),
        (old) => updateCommentInCache(old, commentId, content),
      );

      return { previousComments };
    },
    onError: (error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentsQueryKey(playlistId),
          context.previousComments,
        );
      }
      if (error instanceof APIError) alert(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(playlistId) });
    },
  });
}
export function useDeleteCommentMutation(playlistId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) =>
      deleteComment(Number(playlistId), commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: commentsQueryKey(playlistId),
      });
      const previousComments = queryClient.getQueryData<
        InfiniteData<CommentItemsType>
      >(commentsQueryKey(playlistId));

      queryClient.setQueryData<InfiniteData<CommentItemsType>>(
        commentsQueryKey(playlistId),
        (old) => removeCommentFromCache(old, commentId),
      );

      return { previousComments };
    },
    onError: (error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentsQueryKey(playlistId),
          context.previousComments,
        );
      }
      if (error instanceof APIError) alert(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(playlistId) });
    },
  });
}
