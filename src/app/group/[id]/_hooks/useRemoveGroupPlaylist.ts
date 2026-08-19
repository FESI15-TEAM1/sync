'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { APIError } from '@/lib/http/error';
import { removeGroupPlaylist } from '@/services/group/group.api';
import type { GroupPlaylistResponse } from '@/services/group/group.types';

import { groupPlaylistsQueryKey } from './useGroupPlaylists';

// 그룹 플레이리스트 개별 제거(본인이 담은 것이거나 그룹장만 가능)
export function useRemoveGroupPlaylist(groupId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [removeTarget, setRemoveTarget] =
    useState<GroupPlaylistResponse | null>(null);
  const [removeErrorMessage, setRemoveErrorMessage] = useState<string | null>(
    null,
  );

  const { mutate: removePlaylist, isPending: isRemovingPlaylist } = useMutation(
    {
      mutationFn: (playlistId: number) =>
        removeGroupPlaylist(groupId, playlistId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: groupPlaylistsQueryKey(groupId),
        });
        router.refresh();
        setRemoveTarget(null);
      },
      onError: (error) => {
        setRemoveErrorMessage(
          error instanceof APIError
            ? error.message
            : '플레이리스트 제거 중 오류가 발생했습니다.',
        );
      },
    },
  );

  const handleRemovePlaylist = (playlist: GroupPlaylistResponse) => {
    if (isRemovingPlaylist) return;
    setRemoveErrorMessage(null);
    setRemoveTarget(playlist);
  };

  const handleConfirmRemovePlaylist = () => {
    if (!removeTarget) return;
    removePlaylist(removeTarget.id);
  };

  const handleCloseRemoveModal = () => {
    if (isRemovingPlaylist) return;
    setRemoveTarget(null);
    setRemoveErrorMessage(null);
  };

  return {
    removeTarget,
    removeErrorMessage,
    isRemovingPlaylist,
    handleRemovePlaylist,
    handleConfirmRemovePlaylist,
    handleCloseRemoveModal,
  };
}
