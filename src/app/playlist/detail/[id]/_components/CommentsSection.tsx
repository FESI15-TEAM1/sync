'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import CommentItemList from '@/app/playlist/detail/[id]/_components/CommentItemList';
import InputField from '@/components/InputField';
import { clientFetch } from '@/lib/http/client-fetch';
import { APIError } from '@/lib/http/error';
import { postComments, updateComment } from '@/services/playlist/playlist.api';

export default function CommentsSection({
  playlistId,
  userid,
}: {
  playlistId: string | string[] | undefined;
  userid: string | number | null;
}) {
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState('');

  const commentsQueryKey = ['playlists', playlistId, 'comments'];

  const {
    data: comments,
    isPending: isCommentsPending,
    error: commentsError,
  } = useQuery({
    queryKey: commentsQueryKey,
    queryFn: () =>
      clientFetch<CommentItemsType>(`/playlists/${playlistId}/comments`),
  });

  const { mutate: submitComment } = useMutation({
    mutationFn: () =>
      postComments(Number(playlistId), { content: commentContent }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      setCommentContent('');
    },
    onError: (error) => {
      if (error instanceof APIError) alert(error.message);
    },
  });

  const { mutateAsync: editComment, isPending: isEditingComment } =
    useMutation({
      mutationFn: ({
        commentId,
        content,
      }: {
        commentId: number;
        content: string;
      }) => updateComment(Number(playlistId), commentId, { content }),
      onMutate: async ({ commentId, content }) => {
        await queryClient.cancelQueries({ queryKey: commentsQueryKey });
        const previousComments =
          queryClient.getQueryData<CommentItemsType>(commentsQueryKey);

        queryClient.setQueryData<CommentItemsType>(commentsQueryKey, (old) =>
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
          queryClient.setQueryData(commentsQueryKey, context.previousComments);
        }
        if (error instanceof APIError) alert(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: commentsQueryKey });
      },
    });

  if (isCommentsPending)
    return <div className="text-text-primary font-bold">로딩중...</div>;
  if (commentsError) return <div>에러남</div>;

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-text-primary text-xl font-bold">댓글</h4>
      <CommentItemList
        comments={comments}
        userid={userid}
        onEditSave={(commentId, content) =>
          editComment({ commentId, content })
        }
        isSaving={isEditingComment}
      />
      <InputField>
        <InputField.Input
          placeholder="댓글을 입력해 주세요."
          onChange={(e) => setCommentContent(e.target.value)}
          value={commentContent}
        />
        <InputField.Button onClick={() => submitComment()}>
          작성하기
        </InputField.Button>
      </InputField>
    </div>
  );
}
