'use client';

import {
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import { highlightGroupPlaylist } from '@/services/group/group.api';
import type {
  GetGroupPlaylistsResponse,
  GroupPlaylistResponse,
} from '@/services/group/group.types';

import { groupPlaylistsQueryKey } from './useGroupPlaylists';

// 그룹 플레이리스트 하이라이트(상단 고정, 그룹장만 가능) — 낙관적 업데이트
export function useToggleHighlightPlaylist(groupId: number) {
  const queryClient = useQueryClient();

  const { mutate: toggleHighlight } = useMutation({
    mutationFn: ({
      playlistId,
      isHighlighted,
    }: {
      playlistId: number;
      isHighlighted: boolean;
    }) => highlightGroupPlaylist(groupId, playlistId, { isHighlighted }),
    onMutate: async ({ playlistId, isHighlighted }) => {
      await queryClient.cancelQueries({
        queryKey: groupPlaylistsQueryKey(groupId),
      });

      const previousPlaylists = queryClient.getQueryData<
        InfiniteData<GetGroupPlaylistsResponse>
      >(groupPlaylistsQueryKey(groupId));

      queryClient.setQueryData<InfiniteData<GetGroupPlaylistsResponse>>(
        groupPlaylistsQueryKey(groupId),
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === playlistId ? { ...item, isHighlighted } : item,
              ),
            })),
          },
      );

      return { previousPlaylists };
    },
    onError: (error, _variables, context) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData(
          groupPlaylistsQueryKey(groupId),
          context.previousPlaylists,
        );
      }

      alert(
        error instanceof APIError
          ? error.message
          : '하이라이트 설정 중 오류가 발생했습니다.',
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: groupPlaylistsQueryKey(groupId),
      });
    },
  });

  const handleToggleHighlight = (playlist: GroupPlaylistResponse) => {
    toggleHighlight({
      playlistId: playlist.id,
      isHighlighted: !playlist.isHighlighted,
    });
  };

  return { handleToggleHighlight };
}
