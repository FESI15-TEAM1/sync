'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import {
  editGroupPlaylists,
  getGroupPlaylists,
  leaveGroup,
} from '@/services/group/group.api';
import type { GroupDetailResponse } from '@/services/group/group.types';
import { getUserPlaylists } from '@/services/playlist/playlist.api';

import GroupLeaveModal from './GroupLeaveModal';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

// 그룹 상세 화면에서 한 번에 다룰 플레이리스트 최대 개수(스펙상 페이지 최대치)
const PLAYLIST_QUERY_LIMIT = 50;

type GroupDetailProps = {
  groupId: number;
  group: GroupDetailResponse;
};

export type EditableGroupInfo = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string | null;
};

export default function GroupDetail({ groupId, group }: GroupDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);

  const isLeader = currentUser?.id === group.owner.userId;

  const [isEditPlaylistsOpen, setIsEditPlaylistsOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);

  const groupInfo: EditableGroupInfo = {
    name: group.title,
    description: group.description,
    isPublic: group.isPublic,
    coverImage: group.image,
  };
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // 그룹에 추가된 플레이리스트
  const groupPlaylistsQuery = useQuery({
    queryKey: ['group', groupId, 'playlists'],
    queryFn: () => getGroupPlaylists(groupId, { limit: PLAYLIST_QUERY_LIMIT }),
  });

  const playlists: EditablePlaylist[] = (
    groupPlaylistsQuery.data?.items ?? []
  ).map((item) => ({
    id: item.id,
    title: item.title,
    trackCount: item.trackCount,
    artist: item.owner.nickname,
    image: item.image,
  }));

  // 내가 그룹에 추가할 수 있는 플레이리스트(내 플레이리스트 중 아직 추가되지 않은 것)
  const myPlaylistsQuery = useQuery({
    queryKey: ['user', currentUser?.id, 'playlists'],
    queryFn: () =>
      getUserPlaylists(currentUser!.id, { limit: PLAYLIST_QUERY_LIMIT }),
    enabled: isLeader && currentUser !== null,
  });

  const addedPlaylistIds = new Set(playlists.map((item) => item.id));
  const availablePlaylists: EditablePlaylist[] = (
    myPlaylistsQuery.data?.items ?? []
  )
    .filter((item) => !addedPlaylistIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      trackCount: item.trackCount,
      artist: currentUser?.nickname ?? '',
      image: item.image,
    }));

  const isPlaylistsLoading =
    groupPlaylistsQuery.isPending || myPlaylistsQuery.isPending;

  //그룹 정보 수정
  const handleEditGroupInfo = () => {
    router.push(`/group/${groupId}/edit`);
  };
  //플레이리스트 편집
  const handleEditPlaylists = () => {
    if (isSavingPlaylists || isPlaylistsLoading) return;

    setSaveErrorMessage(null);
    setIsEditPlaylistsOpen(true);
  };

  //그룹 탈퇴
  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  const { mutate: savePlaylists, isPending: isSavingPlaylists } = useMutation({
    mutationFn: (nextPlaylists: EditablePlaylist[]) =>
      editGroupPlaylists(groupId, {
        playlistIds: nextPlaylists.map((item) => item.id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['group', groupId, 'playlists'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user', currentUser?.id, 'playlists'],
      });
      setIsEditPlaylistsOpen(false);
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

  const leaveGroupMutation = useMutation({
    mutationFn: () => {
      if (!currentUser) throw new Error('로그인이 필요합니다.');
      return leaveGroup(groupId, currentUser.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsLeaveGroupOpen(false);
      router.push('/group');
    },
    onError: (error) => {
      if (error instanceof APIError) {
        console.error(error.message);
        alert(error.message);
        return;
      }

      console.error(error);
      alert('그룹 탈퇴 중 오류가 발생했습니다.');
    },
  });

  const handleConfirmLeave = () => {
    if (!currentUser) return;
    leaveGroupMutation.mutate();
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
        <div className="flex items-start gap-4">
          {groupInfo.coverImage ? (
            <Image
              src={groupInfo.coverImage}
              alt={groupInfo.name}
              width={80}
              height={80}
              className="size-20 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div
              className="bg-input size-20 shrink-0 rounded-2xl"
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-text-primary text-xl font-bold">
                {groupInfo.name}
              </h1>
              {/* 케밥 메뉴 */}
              <KebabModal>
                {isLeader ? (
                  <>
                    <KebabModal.Item onClick={handleEditGroupInfo}>
                      그룹 정보 수정
                    </KebabModal.Item>
                    <KebabModal.Item onClick={handleEditPlaylists}>
                      플레이리스트 편집
                    </KebabModal.Item>
                  </>
                ) : (
                  <KebabModal.Item variant="danger" onClick={handleLeaveGroup}>
                    그룹 탈퇴하기
                  </KebabModal.Item>
                )}
              </KebabModal>
            </div>
            <p className="text-text-secondary mt-1 text-sm">
              멤버 {group.memberCount}명 · 플레이리스트 {group.playlistCount}개
            </p>
            {group.inviteCode && (
              <p className="text-text-secondary mt-0.5 text-sm">
                초대코드 {group.inviteCode}
              </p>
            )}
          </div>
        </div>

        {saveErrorMessage && (
          <p role="alert" className="text-sm text-red-500">
            {saveErrorMessage}
          </p>
        )}

        {/* 플레이리스트 편집 모달 */}
        {isEditPlaylistsOpen && (
          <PlaylistEditModal
            isOpen={isEditPlaylistsOpen}
            addedPlaylists={playlists}
            availablePlaylists={availablePlaylists}
            onClose={() => setIsEditPlaylistsOpen(false)}
            onSave={handleSavePlaylists}
          />
        )}

        {/* 그룹 탈퇴 모달 */}
        <GroupLeaveModal
          isOpen={isLeaveGroupOpen}
          groupName={groupInfo.name}
          onClose={() => setIsLeaveGroupOpen(false)}
          onConfirm={handleConfirmLeave}
        />
      </div>
      <div className="mx-auto w-full max-w-md px-5">
        {groupPlaylistsQuery.isPending ? (
          <p className="text-text-secondary text-sm">
            플레이리스트를 불러오는 중입니다...
          </p>
        ) : groupPlaylistsQuery.isError ? (
          <p role="alert" className="text-sm text-red-500">
            플레이리스트를 불러오는데 실패했습니다.
          </p>
        ) : (
          <div className="flex flex-row flex-wrap gap-3">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                img={playlist.image}
                title={playlist.title}
                trackCount={playlist.trackCount}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
