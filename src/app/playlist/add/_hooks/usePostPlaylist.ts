'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { userPlaylistsQueryKey } from '@/app/playlist/[id]/_hooks/useUserPlaylistsQuery';
import { useUserStore } from '@/providers/user-store-provider';
import type { CreatePlaylistRequest } from '@/services/playlist/playlist';
import { postPlaylist } from '@/services/playlist/playlist.api';

export function usePostPlaylist() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.user?.id);

  const {
    mutateAsync: createPlaylist,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (form: CreatePlaylistRequest) => postPlaylist(form),
    onSuccess: () => {
      // 방금 만든 플레이리스트가 내 목록에 바로 보이도록 갱신합니다.
      if (userId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: userPlaylistsQueryKey(String(userId)),
        });
      }
      router.push('/playlist');
    },
  });

  return {
    createPlaylist,
    // 성공 시에는 페이지 이동이 끝날 때까지 제출 상태를 유지해 중복 생성을 막습니다.
    isCreating: isPending || isSuccess,
  };
}
