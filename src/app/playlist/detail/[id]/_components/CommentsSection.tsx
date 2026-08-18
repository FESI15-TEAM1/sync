'use client';

import { useEffect, useRef, useState } from 'react';

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
import { APIError } from '@/lib/http/error';

// 목록 끝에 닿기 전에 미리 다음 페이지를 불러와 스크롤이 끊기지 않게 합니다.
const LOAD_MORE_ROOT_MARGIN = '200px';

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

  // 최신 댓글이 위, 아래로 스크롤할수록 과거 댓글이 이어붙는다. 입력창은 목록 위에
  // 고정된 위치라 페이지가 추가로 로드돼도 밀리지 않는다.
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // fetch가 끝날 때마다 옵저버를 새로 만들면, sentinel이 여전히 화면(+rootMargin) 안에
  // 있을 때 생성 직후 바로 한 번 더 콜백이 와서 다음 페이지를 중복/연쇄 요청하게 된다.
  // 그래서 옵저버는 hasNextPage가 바뀔 때만(=sentinel이 뜨고 사라질 때만) 만들고,
  // fetchNextPage는 매 렌더 재생성될 수 있으므로 의존성에 넣지 않고 ref로 최신 값만
  // 참조한다. fetch 중복 방지도 React state가 아니라 호출 즉시 동기적으로 세팅되는
  // ref로 한다 — state는 리렌더를 거쳐야 반영되므로 그 사이 한 번 더 트리거될 수 있다.
  const isFetchingRef = useRef(false);
  const fetchNextPageRef = useRef(fetchNextPage);
  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage;
  });

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current) {
          isFetchingRef.current = true;
          fetchNextPageRef.current().finally(() => {
            isFetchingRef.current = false;
          });
        }
      },
      { rootMargin: LOAD_MORE_ROOT_MARGIN },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage]);

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
