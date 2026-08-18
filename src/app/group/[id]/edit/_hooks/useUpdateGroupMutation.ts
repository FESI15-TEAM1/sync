'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { groupsQueryKey } from '@/app/group/_hooks/useGroupsQuery';
import { groupPlaylistsQueryKey } from '@/app/group/[id]/_components/GroupDetail';
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
  const queryClient = useQueryClient();

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

      // updateGroup(PATCH)과 editGroupPlaylists(PUT)는 둘 다 절대값을 세팅하는
      // 멱등 요청이다. allSettled로 어느 쪽이 실패했는지 구분해 안내하면,
      // 성공한 쪽을 다시 보내도 값이 그대로 유지되어 재시도만으로 정합성이 맞는다.
      const [groupResult, playlistsResult] = await Promise.allSettled([
        updateGroup(groupId, {
          title,
          description,
          isPublic,
          ...(image ? { image } : {}),
        }),
        editGroupPlaylists(Number(groupId), { playlistIds }),
      ]);

      if (
        groupResult.status === 'rejected' &&
        playlistsResult.status === 'rejected'
      ) {
        throw groupResult.reason;
      }

      if (groupResult.status === 'rejected') {
        throw new Error(
          '그룹 정보 저장에 실패했습니다. 플레이리스트는 반영되었으니 다시 시도해주세요.',
        );
      }

      if (playlistsResult.status === 'rejected') {
        throw new Error(
          '플레이리스트 저장에 실패했습니다. 그룹 정보는 반영되었으니 다시 시도해주세요.',
        );
      }

      return groupId;
    },
    onSuccess: (groupId) => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKey() });
      queryClient.invalidateQueries({
        queryKey: groupPlaylistsQueryKey(Number(groupId)),
      });
      router.push(`/group/${groupId}`);
    },
    onError: (error) => {
      onError(error instanceof Error ? error.message : SUBMIT_ERROR_MESSAGE);
    },
  });
}
