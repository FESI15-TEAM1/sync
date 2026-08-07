'use client';

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
import { updateGroup } from '@/services/group/group.api';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

type Playlist = {
  id: string;
  title: string;
  songCount: number;
};

// TODO: 그룹에 담긴 플레이리스트 목록 API 연동 시 교체. PATCH /groups/{groupId}는
// playlistIds를 받지 않으므로(별도 엔드포인트 PUT /groups/{groupId}/playlists),
// 이 선택 UI는 아직 수정 요청에 반영되지 않는다.
const MOCK_PLAYLISTS: Playlist[] = [
  { id: '1', title: '비 오는 날 감성', songCount: 10 },
  { id: '2', title: '헤비로터', songCount: 20 },
  { id: '3', title: '새벽 드라이브', songCount: 30 },
];

const SUBMIT_ERROR_MESSAGE =
  '그룹 수정에 실패했습니다. 잠시 후 다시 시도해주세요.';

type EditPageProps = {
  groupId: string;
  initialGroup: {
    title: string;
    description: string;
    image: string | null;
    isPublic: boolean;
  };
};

export default function EditPage({ groupId, initialGroup }: EditPageProps) {
  const router = useRouter();

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [groupName, setGroupName] = useState(initialGroup.title);
  const [groupDescription, setGroupDescription] = useState(
    initialGroup.description,
  );
  const [isPublic, setIsPublic] = useState(initialGroup.isPublic);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>(['1']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedName = groupName.trim();
  const trimmedDescription = groupDescription.trim();

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);

    const url = URL.createObjectURL(file);
    setCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedName || !trimmedDescription || selectedPlaylists.length === 0)
      return;

    setIsSubmitting(true);
    setErrorMessage(null);

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

      await updateGroup(groupId, {
        title: trimmedName,
        description: trimmedDescription,
        isPublic,
        ...(image ? { image } : {}),
      });
      router.push(`/group/${groupId}`);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(
        error instanceof APIError ? error.message : SUBMIT_ERROR_MESSAGE,
      );
    }
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
          <ul>
            <div className="w-full scrollbar-none overflow-x-scroll">
              <div className="flex w-max gap-4">
                {MOCK_PLAYLISTS.map((playlist) => {
                  const isSelected = selectedPlaylists.includes(playlist.id);

                  return (
                    <div
                      className="relative cursor-pointer"
                      key={playlist.id}
                      onClick={() => togglePlaylist(playlist.id)}
                    >
                      <PlaylistCard
                        title={playlist.title}
                        trackCount={playlist.songCount}
                      />
                      {isSelected && (
                        <div className='absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-2xl bg-[rgba(0,0,0,50%)] after:block after:text-white after:content-["selected"]' />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ul>

          <p role="alert" className="min-h-5 text-sm text-red-500">
            {errorMessage}
          </p>

          <Button
            className="mt-4 w-full"
            isDisabled={
              !trimmedName ||
              !trimmedDescription ||
              selectedPlaylists.length === 0 ||
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
