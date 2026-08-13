'use client';

import { type SubmitEvent, useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import Modal from '@/components/Modal';
import Textarea from '@/components/Textarea';
import {
  PLAYROOM_DESCRIPTION_MAX_LENGTH,
  PLAYROOM_TITLE_MAX_LENGTH,
} from '@/constants/playroom';
import { hashTagToArray } from '@/utils/playroom/hashTag';

import { useEditPlayroom } from '../../_hooks/useEditPlayroom';

const EDIT_FORM_ID = 'playroom-edit-form';

type PlayroomEditModalProps = {
  isOpen: boolean;
  playroomId: number;
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
};

// 닫혀 있는 동안에는 내용을 언마운트합니다.
// 다시 열 때 입력값과 이전 에러가 초기 상태로 되돌아가므로 별도 초기화 로직이 필요 없습니다.
export default function PlayroomEditModal({
  isOpen,
  ...contentProps
}: PlayroomEditModalProps) {
  if (!isOpen) return null;

  return <PlayroomEditModalContent {...contentProps} />;
}

function PlayroomEditModalContent({
  playroomId,
  initialTitle,
  initialDescription,
  onClose,
}: Omit<PlayroomEditModalProps, 'isOpen'>) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const { editPlayroom, isEditing, errorMessage } = useEditPlayroom(playroomId);

  const isSubmitDisabled = !title.trim() || isEditing;

  const handleClose = () => {
    if (isEditing) return;

    onClose();
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || isEditing) return;

    editPlayroom(
      // AddForm 과 동일하게 설명 본문의 #태그를 해시태그로 추출해 통째로 교체합니다.
      {
        title: trimmedTitle,
        description,
        hashtags: hashTagToArray(description),
      },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Modal
      isOpen
      onClose={handleClose}
      // 수정 요청 중에는 배경 클릭으로 닫히지 않게 합니다.
      closeOnBackdropClick={!isEditing}
      ariaLabelledBy="playroom-edit-modal-title"
    >
      <Modal.Header ariaLabelledById="playroom-edit-modal-title">
        방 정보 수정
      </Modal.Header>

      <Modal.Body>
        <form
          id={EDIT_FORM_ID}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <InputField>
            <InputField.Label>제목</InputField.Label>
            <InputField.Input
              placeholder="방 제목을 입력해주세요."
              value={title}
              maxLength={PLAYROOM_TITLE_MAX_LENGTH}
              onChange={(e) => setTitle(e.target.value)}
            />
          </InputField>

          <Textarea
            label="내용"
            placeholder="플레이룸을 설명하는 내용입니다."
            value={description}
            rows={4}
            maxLength={PLAYROOM_DESCRIPTION_MAX_LENGTH}
            onChange={(e) => setDescription(e.target.value)}
          />
        </form>

        {errorMessage && (
          <p role="alert" className="mt-3 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="md"
          variant="outline"
          isDisabled={isEditing}
          onClick={handleClose}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          취소
        </Button>
        <Button
          type="submit"
          form={EDIT_FORM_ID}
          size="md"
          variant="primary"
          isDisabled={isSubmitDisabled}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          {isEditing ? '수정 중...' : '수정하기'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
