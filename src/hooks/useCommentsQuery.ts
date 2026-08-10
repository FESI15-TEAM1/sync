import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import { clientFetch } from '@/lib/http/client-fetch';
import { APIError } from '@/lib/http/error';
import { postComments, updateComment } from '@/services/playlist/playlist.api';

export const commentsQueryKey = (playlistId: string) =>
  ['playlists', playlistId, 'comments'] as const;

export function useCommentsQuery(playlistId: string) {
  return useQuery({
    queryKey: commentsQueryKey(playlistId),
    queryFn: () =>
      clientFetch<CommentItemsType>(`/playlists/${playlistId}/comments`),
  });
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
      const previousComments = queryClient.getQueryData<CommentItemsType>(
        commentsQueryKey(playlistId),
      );

      queryClient.setQueryData<CommentItemsType>(
        commentsQueryKey(playlistId),
        (old) =>
          old
            ? {
                ...old,
                items: old.items.map((item) =>
                  item.id === commentId ? { ...item, content } : item,
                ),
              }
            : old,
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
