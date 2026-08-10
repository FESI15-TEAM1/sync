'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, type SubmitEvent, useEffect, useState } from 'react';

import defaultCover from '@/assets/images/default.png';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import PlaylistCard from '@/components/domain/PlaylistCard';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import { APIError } from '@/lib/http/error';
import { editGroupPlaylists, updateGroup } from '@/services/group/group.api';
import type { MyPlaylistItem } from '@/services/playlist/playlistCard.type';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

const SUBMIT_ERROR_MESSAGE =
  '그룹 수정에 실패했습니다. 잠시 후 다시 시도해주세요.';

const ALLOWED_COVER_IMAGE_TYPES: UploadUrlRequest['contentType'][] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

const UNSUPPORTED_IMAGE_TYPE_MESSAGE =
  'PNG, JPEG, WEBP, GIF 형식의 이미지만 업로드할 수 있습니다.';

function isAllowedCoverImageType(
  type: string,
): type is UploadUrlRequest['contentType'] {
  return ALLOWED_COVER_IMAGE_TYPES.includes(
    type as UploadUrlRequest['contentType'],
  );
}

type EditPageProps = {
  groupId: string;
  initialGroup: {
    title: string;
    description: string;
    image: string | null;
    isPublic: boolean;
  };
  playlists: MyPlaylistItem[];
  initialSelectedPlaylistIds: number[];
  // 그룹장 편집 시 다른 멤버가 담은 항목. 선택 UI에는 노출하지 않지만
  // 제출 시 최종 목록에 그대로 포함해 제거되지 않게 한다.
  lockedPlaylistIds: number[];
};

export default function EditPage({
  groupId,
  initialGroup,
  playlists,
  initialSelectedPlaylistIds,
  lockedPlaylistIds,
}: EditPageProps) {
  const router = useRouter();

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);
  const [groupName, setGroupName] = useState(initialGroup.title);
  const [groupDescription, setGroupDescription] = useState(
    initialGroup.description,
  );
  const [isPublic, setIsPublic] = useState(initialGroup.isPublic);
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>(
    initialSelectedPlaylistIds,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedName = groupName.trim();
  const trimmedDescription = groupDescription.trim();
  const hasNoPlaylists =
    selectedPlaylists.length === 0 && lockedPlaylistIds.length === 0;

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAllowedCoverImageType(file.type)) {
      setErrorMessage(UNSUPPORTED_IMAGE_TYPE_MESSAGE);
      e.target.value = '';
      return;
    }

    setErrorMessage(null);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const togglePlaylist = (id: number) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const { mutate: submitGroup, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      let image: string | undefined;

      if (coverFile && isAllowedCoverImageType(coverFile.type)) {
        const { uploadUrl, fileUrl } = await requestUploadUrl({
          domain: 'group',
          contentType: coverFile.type,
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

      await Promise.all([
        updateGroup(groupId, {
          title: trimmedName,
          description: trimmedDescription,
          isPublic,
          ...(image ? { image } : {}),
        }),
        editGroupPlaylists(Number(groupId), {
          playlistIds: [...selectedPlaylists, ...lockedPlaylistIds],
        }),
      ]);
    },
    onSuccess: () => {
      router.push(`/group/${groupId}`);
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof APIError ? error.message : SUBMIT_ERROR_MESSAGE,
      );
    },
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedName || !trimmedDescription || hasNoPlaylists) return;

    setErrorMessage(null);
    submitGroup();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-6">
      <BackButton />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer items-center gap-3"
          >
            <Image
              src={coverPreview ?? initialGroup.image ?? defaultCover}
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
            placeholder="그룹 이름을 입력해주세요."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </InputField>

        <Textarea
          label="그룹 소개"
          value={groupDescription}
          placeholder="그룹 소개를 입력해주세요."
          onChange={(e) => setGroupDescription(e.target.value)}
        />

        <fieldset className="flex flex-col gap-2">
          <legend className="text-md mb-1 ml-2 font-bold text-white">
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

          <p role="alert" className="min-h-5 text-sm text-red-500">
            {errorMessage}
          </p>

          <Button
            type="submit"
            className="mt-4 w-full"
            isDisabled={
              !trimmedName ||
              !trimmedDescription ||
              hasNoPlaylists ||
              isSubmitting
            }
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
