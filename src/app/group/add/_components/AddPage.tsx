'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import defaultCover from '@/assets/images/default.png';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import PlaylistCard from '@/components/domain/PlaylistCard';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import { APIError } from '@/lib/http/error';
import { createGroup } from '@/services/group/group.api';
import type { MyPlaylistItem } from '@/services/playlist/playlistCard.type';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

const SUBMIT_ERROR_MESSAGE =
  '그룹 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';

export default function AddPage({
  playlists,
}: {
  playlists: MyPlaylistItem[];
}) {
  const router = useRouter();

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedName = groupName.trim();
  const trimmedDescription = groupDescription.trim();

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);

    // 사용자가 선택한 파일(file)을 브라우저에서 미리 볼 수 있는 임시 URL 생성
    const url = URL.createObjectURL(file);
    // 기존에 저장되어 있던 미리보기 URL을 확인하면서 상태 업데이트
    setCoverPreview((prev) => {
      // 이전 미리보기 URL이 있다면 더 이상 사용하지 않으므로 메모리에서 해제
      if (prev) URL.revokeObjectURL(prev);
      // 새로 만든 이미지 미리보기 URL을 상태에 저장
      return url;
    });
  };

  const togglePlaylist = (id: number) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const { mutate: submitGroup, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      try {
        let image: string | undefined;

        if (coverFile) {
          const { uploadUrl, fileUrl } = await requestUploadUrl({
            domain: 'group',
            contentType: coverFile.type as UploadUrlRequest['contentType'],
          });

          const putResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': coverFile.type },
            body: coverFile,
          });
          if (!putResponse.ok) {
            throw new Error('이미지 업로드에 실패했습니다.');
          }

          image = fileUrl;
        }

        return await createGroup({
          title: trimmedName,
          description: trimmedDescription,
          image,
          isPublic,
          playlistIds: selectedPlaylists,
        });
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw new Error(SUBMIT_ERROR_MESSAGE);
      }
    },
    onSuccess: ({ id }) => {
      router.push(`/group/${id}`);
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof APIError ? error.message : SUBMIT_ERROR_MESSAGE,
      );
    },
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      isSubmitting ||
      !trimmedName ||
      !trimmedDescription ||
      selectedPlaylists.length === 0
    )
      return;

    setErrorMessage(null);
    submitGroup();
  };

  return (
    <div className="mx-auto flex-1 flex-col gap-8 px-5 py-6">
      <BackButton />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label
            htmlFor="image-upload"
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
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>
        <InputField>
          <InputField.Label>그룹 이름</InputField.Label>
          <InputField.Input
            value={groupName}
            placeholder="그룹 이름을 입력해주세요."
            maxLength={50}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </InputField>

        <Textarea
          label="그룹 소개"
          value={groupDescription}
          placeholder="그룹 소개를 입력해주세요."
          maxLength={200}
          onChange={(e) => setGroupDescription(e.target.value)}
          resizable
          minResize="6rem"
          maxResize="16rem"
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
                name="visibility"
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
                name="visibility"
                value="private"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="sr-only"
              />
              비공개
            </label>
          </div>
        </fieldset>

        <div>
          <h2 className="text-md ml-2 font-bold text-white">
            플레이리스트 추가
          </h2>
          {playlists.length === 0 ? (
            <p className="text-text-secondary py-4 text-sm">
              생성된 플레이리스트가 없습니다.
            </p>
          ) : (
            <ul>
              <div className="w-full scrollbar-none overflow-x-scroll">
                <div className="flex w-max gap-4">
                  {playlists.map((playlist) => {
                    const isSelected = selectedPlaylists.includes(playlist.id);

                    return (
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        className="relative w-fit cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
                        key={playlist.id}
                        onClick={() => togglePlaylist(playlist.id)}
                      >
                        <PlaylistCard
                          img={playlist.image}
                          title={playlist.title}
                          trackCount={playlist.trackCount}
                        />
                        {isSelected && (
                          <div className='absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-2xl bg-[rgba(0,0,0,50%)] after:block after:text-white after:content-["선택됨"]' />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </ul>
          )}
        </div>

        <p role="alert" className="min-h-5 text-sm text-red-500">
          {errorMessage}
        </p>

        <Button
          isDisabled={
            !trimmedName ||
            !trimmedDescription ||
            selectedPlaylists.length === 0 ||
            isSubmitting
          }
        >
          {isSubmitting ? '생성 중...' : '그룹 생성하기'}
        </Button>
      </form>
    </div>
  );
}
