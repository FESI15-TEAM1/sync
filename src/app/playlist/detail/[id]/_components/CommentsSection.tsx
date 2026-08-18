'use client';

import { useState } from 'react';

import CommentItemList from '@/app/playlist/detail/[id]/_components/CommentItemList';
import {
  useAddCommentMutation,
  useCommentsQuery,
  useDeleteCommentMutation,
  useEditCommentMutation,
} from '@/app/playlist/detail/[id]/_hooks/useCommentsQuery';
import Button from '@/components/Button';
import ProfilePreviewModal from '@/components/domain/user/ProfilePreviewModal';
import InputField from '@/components/InputField';
import Modal from '@/components/Modal';
import { useLoadMoreObserver } from '@/hooks/useLoadMoreObserver';
import { APIError } from '@/lib/http/error';

export default function CommentsSection({
  playlistId,
  userid,
}: {
  playlistId: string;
  userid: string | null;
}) {
  const [commentContent, setCommentContent] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [previewUserId, setPreviewUserId] = useState<number | null>(null);
  const {
    data,
    isPending: isCommentsPending,
    error: commentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCommentsQuery(playlistId);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  const loadMoreRef = useLoadMoreObserver({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const { mutate: submitComment, isPending: isSubmittingComment } =
    useAddCommentMutation(playlistId);

  const { mutateAsync: editComment, isPending: isEditingComment } =
    useEditCommentMutation(playlistId);
  const {
    mutate: deleteComment,
    isPending: isDeleteComment,
    error: deleteError,
  } = useDeleteCommentMutation(playlistId);

  if (isCommentsPending) {
    return (
      <div className="flex flex-col gap-4">
        <h4 className="text-text-primary text-xl font-bold">댓글</h4>
        <div className="flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 100}ms` }}
              className="bg-border h-14 w-full animate-pulse rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }
  if (commentsError)
    return (
      <p role="alert" className="text-sm text-red-500">
        댓글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </p>
    );

  const handleSubmitComment = () => {
    if (!commentContent.trim() || isSubmittingComment) return;
    submitComment(commentContent, {
      onSuccess: () => setCommentContent(''),
    });
  };
  const handleDeleteComment = () => {
    if (!deleteTargetId) return;
    deleteComment(deleteTargetId, {
      onSuccess: () => setDeleteTargetId(null),
    });
  };
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-text-primary text-xl font-bold">댓글</h4>
      <InputField>
        <InputField.Input
          placeholder="댓글을 입력해 주세요."
          onChange={(e) => setCommentContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmitComment();
          }}
          value={commentContent}
        />
        <InputField.Button
          onClick={handleSubmitComment}
          disabled={!commentContent.trim() || isSubmittingComment}
        >
          작성하기
        </InputField.Button>
      </InputField>
      <CommentItemList
        items={items}
        userid={userid}
        onEditSave={(commentId, content) => editComment({ commentId, content })}
        isSaving={isEditingComment}
        onDeleteRequest={setDeleteTargetId}
        onProfileClick={setPreviewUserId}
      />
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-2">
          {isFetchingNextPage && (
            <span className="text-text-secondary text-sm">
              이전 댓글을 불러오는 중...
            </span>
          )}
        </div>
      )}
      {deleteTargetId && (
        <Modal
          isOpen={true}
          onClose={() => setDeleteTargetId(null)}
          closeOnBackdropClick={!isDeleteComment}
          ariaLabelledBy="delete-comment-modal-title"
        >
          <div className="p-5">
            <Modal.Body>
              <h2
                id="delete-comment-modal-title"
                className="text-text-primary text-center text-lg font-bold"
              >
                댓글을 삭제하시겠습니까?
              </h2>
              {deleteError instanceof APIError && (
                <p
                  role="alert"
                  className="mt-3 text-center text-sm text-red-500"
                >
                  {deleteError.message}
                </p>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                size="md"
                variant="outline"
                className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
                onClick={() => setDeleteTargetId(null)}
                isDisabled={isDeleteComment}
              >
                취소
              </Button>
              <Button
                type="button"
                size="md"
                variant="primary"
                className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
                onClick={handleDeleteComment}
                isDisabled={isDeleteComment}
              >
                {isDeleteComment ? '삭제 중...' : '삭제'}
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      )}
      <ProfilePreviewModal
        userId={previewUserId}
        isOpen={previewUserId !== null}
        onClose={() => setPreviewUserId(null)}
      />
    </div>
  );
}
