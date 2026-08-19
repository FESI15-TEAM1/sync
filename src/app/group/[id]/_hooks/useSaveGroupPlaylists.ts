'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { userPlaylistsQueryKey } from '@/app/group/_hooks/useMyPlaylistsQuery';
import { APIError } from '@/lib/http/error';
import { editGroupPlaylists } from '@/services/group/group.api';

import type { EditablePlaylist } from '../_components/PlaylistEditModal';
import { groupPlaylistsQueryKey } from './useGroupPlaylists';

// 그룹 플레이리스트 편집(전체 교체) 저장
export function useSaveGroupPlaylists(
  groupId: number,
  currentUserId: number | undefined,
  onSaved: () => void,
) {
  const queryClient = useQueryClient();
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(
    null,
  );

  const { mutate: savePlaylists, isPending: isSavingPlaylists } = useMutation({
    mutationFn: (nextPlaylists: EditablePlaylist[]) =>
      editGroupPlaylists(groupId, {
        playlistIds: nextPlaylists.map((item) => item.id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupPlaylistsQueryKey(groupId),
      });
      if (currentUserId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: userPlaylistsQueryKey(currentUserId),
        });
      }
      onSaved();
    },
    onError: (error) => {
      setSaveErrorMessage(
        error instanceof APIError
          ? error.message
          : '플레이리스트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const handleSavePlaylists = (nextPlaylists: EditablePlaylist[]) => {
    savePlaylists(nextPlaylists);
  };

  const resetSaveError = () => setSaveErrorMessage(null);

  return {
    handleSavePlaylists,
    isSavingPlaylists,
    saveErrorMessage,
    resetSaveError,
  };
}
