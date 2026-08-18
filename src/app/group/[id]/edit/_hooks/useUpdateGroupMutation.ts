'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { editGroupPlaylists, updateGroup } from '@/services/group/group.api';
import { requestUploadUrl } from '@/services/upload/upload.api';
import type { UploadUrlRequest } from '@/services/upload/upload.types';

const SUBMIT_ERROR_MESSAGE =
  '그룹 수정에 실패했습니다. 잠시 후 다시 시도해주세요.';

export const ALLOWED_COVER_IMAGE_TYPES: UploadUrlRequest['contentType'][] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

export function isAllowedCoverImageType(
  type: string,
): type is UploadUrlRequest['contentType'] {
  return ALLOWED_COVER_IMAGE_TYPES.includes(
    type as UploadUrlRequest['contentType'],
  );
}

type UpdateGroupParams = {
  groupId: string;
  title: string;
  description: string;
  isPublic: boolean;
  coverFile: File | null;
  playlistIds: number[];
};

export function useUpdateGroupMutation({
  onError,
}: {
  onError: (message: string) => void;
}) {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      groupId,
      title,
      description,
      isPublic,
      coverFile,
      playlistIds,
    }: UpdateGroupParams) => {
      let image: string | undefined;

      if (coverFile && isAllowedCoverImageType(coverFile.type)) {
        const { uploadUrl, fileUrl } = await requestUploadUrl({
          domain: 'group',
          contentType: coverFile.type,
        });

        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': coverFile.type },
          body: coverFile,
        });
        if (!response.ok) {
          throw new Error('이미지 업로드에 실패했습니다.');
        }

        image = fileUrl;
      }

      await Promise.all([
        updateGroup(groupId, {
          title,
          description,
          isPublic,
          ...(image ? { image } : {}),
        }),
        editGroupPlaylists(Number(groupId), { playlistIds }),
      ]);

      return groupId;
    },
    onSuccess: (groupId) => {
      router.push(`/group/${groupId}`);
    },
    onError: (error) => {
      onError(
        error instanceof APIError ? error.message : SUBMIT_ERROR_MESSAGE,
      );
    },
  });
}
