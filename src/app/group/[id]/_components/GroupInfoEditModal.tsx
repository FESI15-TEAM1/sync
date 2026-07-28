'use client';

import Image from 'next/image';
import { type ChangeEvent, useState } from 'react';

import defaultCover from '@/assets/images/default.png';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Textarea from '@/components/Textarea';

export type EditableGroupInfo = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string | null;
};

type GroupInfoEditModalProps = {
  isOpen: boolean;
  groupInfo: EditableGroupInfo;
  onClose: () => void;
  onSave: (groupInfo: EditableGroupInfo) => void;
};

export default function GroupInfoEditModal({
  isOpen,
  groupInfo,
  onClose,
  onSave,
}: GroupInfoEditModalProps) {
  const [name, setName] = useState(groupInfo.name);
  const [description, setDescription] = useState(groupInfo.description);
  const [isPublic, setIsPublic] = useState(groupInfo.isPublic);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    groupInfo.coverImage,
  );

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleSave = () => {
    onSave({ name, description, isPublic, coverImage: coverPreview });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>그룹 정보 수정</Modal.Header>

      <Modal.Body>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <label
              htmlFor="group-cover-upload"
              className="flex cursor-pointer items-center gap-3"
            >
              <Image
                src={coverPreview ?? defaultCover}
                alt="그룹 커버"
                width={72}
                height={72}
                className="h-18 w-18 rounded-2xl object-cover"
              />
              <span className="text-primary text-sm">커버 이미지 변경</span>
            </label>
            <input
              id="group-cover-upload"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>

          <Input
            label="그룹 이름"
            value={name}
            placeholder="그룹 이름을 입력해주세요."
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            label="그룹 소개"
            value={description}
            placeholder="그룹 소개를 입력해주세요."
            onChange={(e) => setDescription(e.target.value)}
            width="100%"
          />

          <fieldset className="flex flex-col gap-2">
            <legend className="text-md ml-2 font-bold text-white">
              공개 여부
            </legend>
            <div className="border-border bg-bg-card flex overflow-hidden rounded-md border">
              <label
                className={`flex-1 cursor-pointer py-2 text-center text-sm ${
                  isPublic
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <input
                  type="radio"
                  name="group-visibility"
                  value="public"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="sr-only"
                />
                공개
              </label>
              <label
                className={`flex-1 cursor-pointer py-2 text-center text-sm ${
                  !isPublic
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <input
                  type="radio"
                  name="group-visibility"
                  value="private"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="sr-only"
                />
                비공개
              </label>
            </div>
          </fieldset>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          type="button"
          size="md"
          variant="outline"
          isDisabled={false}
          onClick={onClose}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          취소
        </Button>

        <Button
          type="button"
          size="md"
          variant="primary"
          isDisabled={!name || !description}
          onClick={handleSave}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          저장하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
