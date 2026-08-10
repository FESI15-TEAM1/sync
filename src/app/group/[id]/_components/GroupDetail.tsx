'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import { leaveGroup } from '@/services/group/group.api';
import type { GroupDetailResponse } from '@/services/group/group.types';

import GroupLeaveModal from './GroupLeaveModal';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

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

const MOCK_ADDED_PLAYLISTS: EditablePlaylist[] = [
  {
    id: 1,
    title: '비 오는 날 감성',
    artist: 'ㄹㅇ좋음',
    trackCount: 18,
  },
  {
    id: 2,
    title: 'Midnight Rain',
    artist: 'Aria Chen',
    trackCount: 12,
  },
];

const MOCK_AVAILABLE_PLAYLISTS: EditablePlaylist[] = [
  { id: 3, title: 'jpop', artist: 'ㄹㅇ좋음', trackCount: 20 },
  {
    id: 4,
    title: '습할때 듣는노래',
    artist: 'Aria Chen',
    trackCount: 15,
  },
];

export default function GroupDetail({ groupId, group }: GroupDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);

  const isLeader = currentUser?.id === group.publicGroupOwner.userId;

  const [isEditPlaylistsOpen, setIsEditPlaylistsOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);

  const groupInfo: EditableGroupInfo = {
    name: group.title,
    description: group.description,
    isPublic: group.isPublic,
    coverImage: group.image,
  };
  const [playlists, setPlaylists] =
    useState<EditablePlaylist[]>(MOCK_ADDED_PLAYLISTS);
  const [availablePlaylists, setAvailablePlaylists] = useState<
    EditablePlaylist[]
  >(MOCK_AVAILABLE_PLAYLISTS);

  //그룹 정보 수정
  const handleEditGroupInfo = () => {
    router.push(`/group/${groupId}/edit`);
  };
  //플레이리스트 편집
  const handleEditPlaylists = () => {
    setIsEditPlaylistsOpen(true);
  };

  //그룹 탈퇴
  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  const handleSavePlaylists = (nextPlaylists: EditablePlaylist[]) => {
    const nextIds = new Set(nextPlaylists.map((item) => item.id));
    const removed = playlists.filter((item) => !nextIds.has(item.id));
    const keptAvailable = availablePlaylists.filter(
      (item) => !nextIds.has(item.id),
    );

    setPlaylists(nextPlaylists);
    setAvailablePlaylists([...keptAvailable, ...removed]);
    setIsEditPlaylistsOpen(false);
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
        <div className="flex flex-row flex-wrap gap-3">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              title={playlist.title}
              trackCount={playlist.trackCount}
            />
          ))}
        </div>
      </div>
    </>
  );
}
