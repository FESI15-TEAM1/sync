'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { groupsQueryKey } from '@/app/group/_hooks/useGroupsQuery';
import defaultCover from '@/assets/images/default.png';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import PlaylistCard from '@/components/domain/PlaylistCard';
import InputField from '@/components/InputField';
import Textarea from '@/components/Textarea';
import Toggle from '@/components/Toggle';
import { APIError } from '@/lib/http/error';
import { createGroup } from '@/services/group/group.api';
import type { MyPlaylistItem } from '@/services/playlist/playlistCard.type';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

import {
  addGroupSchema,
  type GroupFormValues,
} from '../_schemas/addGroup.schema';

const SUBMIT_ERROR_MESSAGE =
  '그룹 생성에 실패했습니다. 잠시 후 다시 시도해주세요.';

export default function AddPage({
  playlists,
}: {
  playlists: MyPlaylistItem[];
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(addGroupSchema),
    mode: 'onChange',
    defaultValues: {
      groupName: '',
      groupDescription: '',
      isPublic: false,
      selectedPlaylists: [],
    },
  });

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverFile(file);

    //기존 미리보기 URL을 메모리에서 해제
    setCoverPreview((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }

      return URL.createObjectURL(file);
    });
  };

  const { mutate: submitGroup, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: GroupFormValues) => {
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
          title: data.groupName,
          description: data.groupDescription,
          image,
          isPublic: data.isPublic,
          playlistIds: data.selectedPlaylists,
        });
      } catch (error) {
        if (error instanceof APIError) throw error;
        throw new Error(SUBMIT_ERROR_MESSAGE);
      }
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKey() });
      router.push(`/group/${id}`);
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof APIError ? error.message : SUBMIT_ERROR_MESSAGE,
      );
    },
  });

  const onSubmit = (data: GroupFormValues) => {
    setErrorMessage(null);
    submitGroup(data);
  };

  return (
    <div className="mx-auto flex flex-col gap-4 px-5 py-6">
      <BackButton />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
            {...register('groupName')}
            placeholder="그룹 이름을 입력해주세요."
            maxLength={50}
          />
          {errors.groupName?.message && (
            <p className="text-sm text-red-500">{errors.groupName.message}</p>
          )}
        </InputField>

        <Textarea
          label="그룹 소개"
          {...register('groupDescription')}
          placeholder="그룹 소개를 입력해주세요."
          maxLength={200}
          resizable
          minResize="6rem"
          maxResize="16rem"
        />
        {errors.groupDescription?.message && (
          <p className="text-sm text-red-500">
            {errors.groupDescription.message}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <span className="text-md ml-2 font-bold text-white">공개 여부</span>

          <Controller
            name="isPublic"
            control={control}
            render={({ field }) => (
              <Toggle checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-md ml-2 font-bold text-white">
            플레이리스트 추가
          </h2>
          {playlists.length === 0 ? (
            <p className="text-text-secondary py-4 text-sm">
              생성된 플레이리스트가 없습니다.
            </p>
          ) : (
            <Controller
              name="selectedPlaylists"
              control={control}
              render={({ field }) => (
                <ul className="w-full overflow-x-scroll scrollbar-none">
                  <div className="flex w-max gap-4">
                    {playlists.map((playlist) => {
                      const isSelected = field.value.includes(playlist.id);

                      const handlePlaylistClick = () => {
                        const nextValue = isSelected
                          ? field.value.filter((id) => id !== playlist.id)
                          : [...field.value, playlist.id];

                        field.onChange(nextValue);
                      };

                      return (
                        <li key={playlist.id}>
                          <button
                            type="button"
                            aria-pressed={isSelected}
                            className="relative w-fit cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
                            onClick={handlePlaylistClick}
                          >
                            <PlaylistCard
                              img={playlist.image}
                              title={playlist.title}
                              trackCount={playlist.trackCount}
                            />

                            {isSelected && (
                              <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-2xl bg-[rgba(0,0,0,50%)] after:block after:text-white after:content-['선택됨']" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </div>
                </ul>
              )}
            />
          )}
        </div>

        <p role="alert" className="min-h-5 text-sm text-red-500">
          {errorMessage}
        </p>

        <Button isDisabled={!isValid || isSubmitting}>
          {isSubmitting ? '생성 중...' : '그룹 생성하기'}
        </Button>
      </form>
    </div>
  );
}
