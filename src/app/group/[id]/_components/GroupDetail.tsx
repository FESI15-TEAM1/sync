'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';
import { APIError } from '@/lib/http/error';
import { editGroupPlaylists } from '@/services/group/group.api';

import GroupLeaveModal from './GroupLeaveModal';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

type GroupDetailProps = {
  groupId: number;
  isLeader: boolean;
  isJoined: boolean;
  addedPlaylists: EditablePlaylist[];
  availablePlaylists: EditablePlaylist[];
};

export type EditableGroupInfo = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string | null;
};

const MOCK_GROUP_INFO: EditableGroupInfo = {
  name: '인디밴드 러버스',
  description: '인디 음악을 좋아하는 사람들의 모임',
  isPublic: false,
  coverImage: null,
};

const MOCK_GROUP_META = {
  memberCount: 32,
  inviteCode: 'IN9X2K',
};

export default function GroupDetail({
  groupId,
  isLeader,
  isJoined,
  addedPlaylists,
  availablePlaylists: initialAvailablePlaylists,
}: GroupDetailProps) {
  const router = useRouter();

  const [isEditPlaylistsOpen, setIsEditPlaylistsOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);

  const [groupInfo] = useState<EditableGroupInfo>(MOCK_GROUP_INFO);
  const [playlists, setPlaylists] = useState<EditablePlaylist[]>(
    addedPlaylists,
  );
  const [availablePlaylists, setAvailablePlaylists] = useState<
    EditablePlaylist[]
  >(initialAvailablePlaylists);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(
    null,
  );

  //그룹 정보 수정
  const handleEditGroupInfo = () => {
    router.push(`/group/${groupId}/edit`);
  };
  //플레이리스트 편집
  const handleEditPlaylists = () => {
    if (isSavingPlaylists) return;

    setSaveErrorMessage(null);
    setIsEditPlaylistsOpen(true);
  };

  //그룹 탈퇴
  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  const { mutate: savePlaylists, isPending: isSavingPlaylists } = useMutation(
    {
      mutationFn: (nextPlaylists: EditablePlaylist[]) =>
        editGroupPlaylists(groupId, {
          playlistIds: nextPlaylists.map((item) => item.id),
        }),
      onSuccess: (updated) => {
        const updatedIds = new Set(updated.map((item) => item.id));
        const keptAvailable = availablePlaylists.filter(
          (item) => !updatedIds.has(item.id),
        );
        const removed = playlists.filter(
          (item) => !updatedIds.has(item.id),
        );

        setPlaylists(
          updated.map((item) => ({
            id: item.id,
            title: item.title,
            trackCount: item.trackCount,
            artist: item.owner.nickname,
          })),
        );
        setAvailablePlaylists([...keptAvailable, ...removed]);
        setIsEditPlaylistsOpen(false);
      },
      onError: (error) => {
        setSaveErrorMessage(
          error instanceof APIError
            ? error.message
            : '플레이리스트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
        );
      },
    },
  );

  const handleSavePlaylists = (nextPlaylists: EditablePlaylist[]) => {
    savePlaylists(nextPlaylists);
  };

  const handleConfirmLeave = () => {
    console.log('Leave group', groupId);
    setIsLeaveGroupOpen(false);
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
        <div className="flex items-start gap-4">
          <div className="bg-input size-20 shrink-0 rounded-2xl" aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-text-primary text-xl font-bold">
                {groupInfo.name}
              </h1>
              {/* 케밥 메뉴 */}
              <KebabModal>
                {isLeader || !isJoined ? (
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
              멤버 {MOCK_GROUP_META.memberCount}명 · 플레이리스트{' '}
              {playlists.length}개
            </p>
            <p className="text-text-secondary mt-0.5 text-sm">
              초대코드 {MOCK_GROUP_META.inviteCode}
            </p>
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
