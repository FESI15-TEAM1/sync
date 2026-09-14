'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';

import AddedTracksSection from '@/app/playlist/add/_components/AddedTracksSection';
import PlaylistThumbnailField from '@/app/playlist/add/_components/PlaylistThumbnailField';
import TrackSearchSection from '@/app/playlist/add/_components/TrackSearchSection';
import { usePostPlaylist } from '@/app/playlist/add/_hooks/usePostPlaylist';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import Toggle from '@/components/Toggle';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { APIError } from '@/lib/http/error';
import type {
  CreatePlaylistRequest,
  PlaylistTrack,
} from '@/services/playlist/playlist';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

import {
  type AddPlaylistFormValues,
  addPlaylistSchema,
} from '../_schemas/addPlaylist.schema';

const ConfirmModal = dynamic(() => import('@/components/domain/ConfirmModal'));

export default function AddForm() {
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<AddPlaylistFormValues>({
    resolver: zodResolver(addPlaylistSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      isPublic: true,
      tracks: [],
    },
  });
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const myModal = useConfirmModal();

  const router = useRouter();
  const { createPlaylist, isCreating } = usePostPlaylist();
  const isSubmitting = isUploadingImage || isCreating;

  const addedVideoIds = new Set(tracks.map((track) => track.videoId));

  const handleAddTrack = (track: PlaylistTrack) => {
    setTracks((prev) => [...prev, track]);
  };
  const handleDeleteTrack = (track: PlaylistTrack) => {
    setTracks((prev) => prev.filter((item) => item.videoId !== track.videoId));
  };
  const handleReorderTracks = (tracks: PlaylistTrack[]) => {
    setTracks(tracks);
  };
  const handleCreatePlaylist: SubmitHandler<CreatePlaylistRequest> = async (
    data,
  ) => {
    if (isSubmitting) return;
    try {
      let image = '';

      if (imgFile) {
        setIsUploadingImage(true);
        try {
          const { uploadUrl, fileUrl } = await requestUploadUrl({
            domain: 'playlist',
            contentType: imgFile.type as UploadUrlRequest['contentType'],
          });
          const putResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': imgFile.type },
            body: imgFile,
          });
          if (!putResponse.ok) {
            throw new Error('이미지 업로드에 실패했습니다.');
          }
          image = fileUrl;
        } finally {
          setIsUploadingImage(false);
        }
      }
      await createPlaylist({ ...data, image, tracks: tracks });
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 400) {
          myModal.open();
        }
        if (error.status === 401) {
          router.replace('/login');
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreatePlaylist)}
      className="flex flex-col items-center gap-4"
    >
      {myModal.isOpen && (
        <ConfirmModal
          {...myModal.modalProps}
          description="다시 시도해 주세요"
          title="플레이리스트 생성중 오류가 발생하였습니다."
        />
      )}
      <div className="flex w-full">
        <BackButton type="button" fallbackUrl="/playlist" />
      </div>

      <fieldset disabled={isSubmitting} className="contents">
        <PlaylistThumbnailField onFileSelect={setImgFile} />

        {/* 플레이리스트 이름 색션 */}
        <InputField className="w-full">
          <InputField.Label>플레이리스트 이름 </InputField.Label>
          <InputField.Input
            {...register('title')}

            placeholder="플레이리스트 이름을 입력하세요"
          ></InputField.Input>
          <InputField.Error>{errors.title?.message}</InputField.Error>
        </InputField>
        <div className="mb-4 w-full">
          <Textarea
            {...register('description')}
            label="플레이리스트 설명"

            placeholder={`공부할때 들으면 집중 잘되는 노래들로 모아봤습니다.\n비슷한 취향있으신 분은 좋아요 그룹생성 요청 눌러주세요!`}
          />
        </div>
        <div className="mb-4 flex w-full flex-col gap-4">
          <label className="ml-2 text-base font-bold text-white">
            공개여부
          </label>
          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => {
              return <Toggle checked={field.value} onChange={field.onChange} />;
            }}
          />
        </div>

        <TrackSearchSection
          addedVideoIds={addedVideoIds}
          onAddTrack={handleAddTrack}
        />

        <AddedTracksSection
          tracks={tracks}
          onReorder={handleReorderTracks}
          onRemoveTrack={handleDeleteTrack}
        />
      </fieldset>

      <Button
        type="submit"
        className="w-full"
        isDisabled={isSubmitting || !isValid}
      >
        {isSubmitting ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  );
}
