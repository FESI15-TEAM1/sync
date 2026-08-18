'use client';

import { useRouter } from 'next/navigation';
import type { SubmitEvent } from 'react';
import { useState } from 'react';

import Button from '@/components/Button';
import LiveHeartbeat from '@/components/domain/playroom/LiveHeartbeat';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import {
  PLAYROOM_DESCRIPTION_MAX_LENGTH,
  PLAYROOM_TITLE_MAX_LENGTH,
} from '@/constants/playroom';
import { hashTagToArray } from '@/utils/playroom/hashTag';

import { usePostPlayroom } from '../_hooks/usePostPlayroom';
import DescriptionHint from './DescriptionHint';
import PlaylistSelector from './PlaylistSelector';

export default function AddForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );

  const { createPlayroom, isCreating, errorMessage } = usePostPlayroom();

  const isSubmitDisabled =
    !title.trim() || selectedPlaylistId === null || isCreating;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || selectedPlaylistId === null || isCreating) return;

    createPlayroom({
      title: trimmedTitle,
      description,
      playlistId: selectedPlaylistId,
      hashtags: hashTagToArray(description),
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* headline */}
      <h2 className="text-2xl font-bold text-white">플레이룸 시작하기</h2>

      {/* live type notice */}
      <div className="text-text-secondary py-2 text-left text-sm font-normal">
        <span className="text-text-primary inline-flex items-center gap-1 align-bottom">
          <LiveHeartbeat size="md" /> 라이브
        </span>
        가 시작됩니다!
        <br /> 내가 방장이 되어 나의 플레이리스트를 재생하고 다함께 청취할 수
        있습니다!
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* set playroom title */}
        <InputField>
          <InputField.Label>제목</InputField.Label>
          <InputField.Input
            placeholder="제목을 입력해주세요."
            value={title}
            maxLength={PLAYROOM_TITLE_MAX_LENGTH}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputField>

        {/* set playroom description */}
        <Textarea
          label={<DescriptionHint />}
          placeholder="설명을 입력해주세요. 플레이룸 설명은 목록에서만 나타납니다."
          value={description}
          maxLength={PLAYROOM_DESCRIPTION_MAX_LENGTH}
          onChange={(e) => setDescription(e.target.value)}
          resizable={true}
          minResize="66px"
          maxResize="100px"
        />

        {/* pick playlist */}
        <h3 className="text-base font-bold text-white">
          공유 할 플레이리스트 선택
        </h3>

        <PlaylistSelector
          selectedPlaylistId={selectedPlaylistId}
          onSelect={setSelectedPlaylistId}
        />

        <p role="alert" className="min-h-5 text-sm text-red-500">
          {errorMessage}
        </p>

        {/* buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button isDisabled={isSubmitDisabled} type="submit">
            {isCreating ? '생성 중...' : '생성하기'}
          </Button>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-text-secondary hover:text-text-primary cursor-pointer font-bold"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
