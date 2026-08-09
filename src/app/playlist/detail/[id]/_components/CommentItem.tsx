'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { CommentItemType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import defaultImage from '@/assets/images/default.png';
import Input from '@/components/Input';
import { formatTimeAgo } from '@/lib/formatITimeAgo';

export default function CommentItem({
  comment,
  userid,
  onEditSave,
  onDeleteRequest,
  isSaving,
}: {
  comment: CommentItemType;
  userid: string | null;
  onEditSave: (commentId: number, content: string) => Promise<unknown>;
  onDeleteRequest: (commentId: number) => void;
  isSaving: boolean;
}) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editComments, setEditComments] = useState(comment.content);

  const handleEditStart = () => {
    setEditComments(comment.content);
    setIsEdit(true);
  };

  const handleEditCancel = () => {
    setEditComments(comment.content);
    setIsEdit(false);
  };

  const handleEditSave = async () => {
    const content = editComments.trim();
    if (!content || isSaving) return;
    if (content === comment.content) {
      setIsEdit(false);
      return;
    }
    try {
      await onEditSave(comment.id, content);
      setIsEdit(false);
    } catch {
      // 에러는 상위에서 alert로 안내 — 재시도할 수 있도록 편집 상태는 유지
    }
  };

  return (
    <div className="text-text-primary relative flex items-center gap-3">
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full">
        <Image
          src={comment.author.image || defaultImage}
          alt="프로필"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div>
        <div className="flex gap-5 text-start">
          <span className="text-sm">{comment.author.nickname}</span>
          <span className="text-text-secondary text-sm">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        {isEdit ? (
          <Input
            autoFocus
            disabled={isSaving}
            onChange={(e) => setEditComments(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleEditSave();
              }
            }}
            value={editComments}
            className="w-full rounded-none border-0 border-b border-transparent bg-transparent p-0 text-sm text-white transition-colors focus:border-white focus:outline-none disabled:opacity-50"
          />
        ) : (
          <span className="text-sm">{comment.content}</span>
        )}
      </div>
      {Number(userid) == comment.author.userId && (
        <div className="text-text-secondary absolute right-0 flex gap-4 text-[12px]">
          {isEdit ? (
            <>
              <button
                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleEditSave}
                disabled={isSaving}
              >
                저장
              </button>
              <button
                className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleEditCancel}
                disabled={isSaving}
              >
                취소
              </button>
              <button
                className="cursor-pointer text-red-900 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => onDeleteRequest(comment.id)}
                disabled={isSaving}
              >
                삭제
              </button>
            </>
          ) : (
            <button className="cursor-pointer" onClick={handleEditStart}>
              수정
            </button>
          )}
        </div>
      )}
    </div>
  );
}
