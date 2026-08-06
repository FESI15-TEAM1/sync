'use client';

import { useRouter } from 'next/navigation';
import type { SubmitEvent } from 'react';
import { useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import { APIError } from '@/lib/http/error';
import { type MyPlaylistItem } from '@/services/playlist/playlistCard.type';
import { postPlayroom } from '@/services/playroom/playroom.api';
import { hashTagToArray } from '@/utils/playroom/hashTag';

import PlaylistSelector from './PlaylistSelector';

const SUBMIT_ERROR_MESSAGE =
  '플레이룸 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';

// 백엔드 스펙(PlayroomCreateRequest)과 동일한 길이 제한
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

export default function AddForm({
  playlists,
}: {
  playlists: MyPlaylistItem[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSubmitDisabled =
    !title.trim() || selectedPlaylistId === null || isSubmitting;

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || selectedPlaylistId === null || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { id } = await postPlayroom({
        title: trimmedTitle,
        description,
        playlistId: selectedPlaylistId,
        hashtags: hashTagToArray(description),
      });
      router.push(`/playroom/${id}`);
    } catch (error) {
      // 성공 시에는 페이지 이동이 끝날 때까지 제출 상태를 유지해 중복 생성을 막는다.
      setIsSubmitting(false);
      setErrorMessage(
        error instanceof APIError ? error.message : SUBMIT_ERROR_MESSAGE,
      );
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* headline */}
      <h2 className="text-xl font-bold text-white">플레이룸 시작하기</h2>

      {/* live type notice */}
      <div className="bg-bg-card text-text-secondary flex items-center justify-center rounded-lg py-2 text-xs font-semibold">
        🔴 라이브
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* set playroom title */}
        <InputField>
          <InputField.Label>제목</InputField.Label>
          <InputField.Input
            placeholder="예: 금귀인 내가 말아주는 플레이리스트!"
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            onChange={(e) => setTitle(e.target.value)}
          />
        </InputField>

        {/* set playroom description */}
        <Textarea
          label="내용"
          placeholder="플레이룸을 설명하는 내용입니다."
          value={description}
          maxLength={DESCRIPTION_MAX_LENGTH}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* pick playlist */}
        <h3 className="text-base font-bold text-white">
          공유 할 플레이리스트 선택
        </h3>

        <PlaylistSelector
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onSelect={setSelectedPlaylistId}
        />

        <p role="alert" className="min-h-5 text-sm text-red-500">
          {errorMessage}
        </p>

        {/* buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button isDisabled={isSubmitDisabled} type="submit">
            {isSubmitting ? '생성 중...' : '생성하기'}
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
