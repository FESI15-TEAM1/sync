'use client';

import { useState } from 'react';

import CommentItemList from '@/app/playlist/detail/[id]/_components/CommentItemList';
import InputField from '@/components/InputField';
import {
  useAddCommentMutation,
  useCommentsQuery,
  useEditCommentMutation,
} from '@/hooks/useCommentsQuery';
import {} from '@/lib/http/client-fetch';

export default function CommentsSection({
  playlistId,
  userid,
}: {
  playlistId: string;
  userid: string | null;
}) {
  const [commentContent, setCommentContent] = useState('');

  const {
    data: comments,
    isPending: isCommentsPending,
    error: commentsError,
  } = useCommentsQuery(playlistId);

  const { mutate: submitComment, isPending: isSubmittingComment } =
    useAddCommentMutation(playlistId);

  const { mutateAsync: editComment, isPending: isEditingComment } =
    useEditCommentMutation(playlistId);

  if (isCommentsPending)
    return <div className="text-text-primary font-bold">로딩중...</div>;
  if (commentsError)
    return <div>댓글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>;

  const handleSubmitComment = () => {
    if (!commentContent.trim() || isSubmittingComment) return;
    submitComment(commentContent, {
      onSuccess: () => setCommentContent(''),
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-text-primary text-xl font-bold">댓글</h4>
      <CommentItemList
        comments={comments}
        userid={userid}
        onEditSave={(commentId, content) => editComment({ commentId, content })}
        isSaving={isEditingComment}
      />
      <InputField>
        <InputField.Input
          placeholder="댓글을 입력해 주세요."
          onChange={(e) => setCommentContent(e.target.value)}
          value={commentContent}
        />
        <InputField.Button
          onClick={handleSubmitComment}
          disabled={!commentContent.trim() || isSubmittingComment}
        >
          작성하기
        </InputField.Button>
      </InputField>
    </div>
  );
}
