'use client';

import { useState } from 'react';

import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';

import GroupInfoEditModal, {
  type EditableGroupInfo,
} from './GroupInfoEditModal';
import GroupLeaveModal from './GroupLeaveModal';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

type GroupDetailProps = {
  groupId: number;
  isLeader: boolean;
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

const MOCK_ADDED_PLAYLISTS: EditablePlaylist[] = [
  {
    id: '1',
    title: '비 오는 날 감성',
    artist: 'ㄹㅇ좋음',
    trackCount: 18,
  },
  {
    id: '2',
    title: 'Midnight Rain',
    artist: 'Aria Chen',
    trackCount: 12,
  },
];

const MOCK_AVAILABLE_PLAYLISTS: EditablePlaylist[] = [
  { id: '3', title: 'jpop', artist: 'ㄹㅇ좋음', trackCount: 20 },
  {
    id: '4',
    title: '습할때 듣는노래',
    artist: 'Aria Chen',
    trackCount: 15,
  },
];

export default function GroupDetail({ groupId, isLeader }: GroupDetailProps) {
  const [isEditGroupInfoOpen, setIsEditGroupInfoOpen] = useState(false);
  const [isEditPlaylistsOpen, setIsEditPlaylistsOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);

  const [groupInfo, setGroupInfo] =
    useState<EditableGroupInfo>(MOCK_GROUP_INFO);
  const [playlists, setPlaylists] =
    useState<EditablePlaylist[]>(MOCK_ADDED_PLAYLISTS);
  const [availablePlaylists, setAvailablePlaylists] = useState<
    EditablePlaylist[]
  >(MOCK_AVAILABLE_PLAYLISTS);

  //그룹 정보 수정
  const handleEditGroupInfo = () => {
    setIsEditGroupInfoOpen(true);
  };
  //플레이리스트 편집
  const handleEditPlaylists = () => {
    setIsEditPlaylistsOpen(true);
  };

  //그룹 탈퇴
  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  const handleSaveGroupInfo = (nextGroupInfo: EditableGroupInfo) => {
    setGroupInfo(nextGroupInfo);
    setIsEditGroupInfoOpen(false);
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
              멤버 {MOCK_GROUP_META.memberCount}명 · 플레이리스트{' '}
              {playlists.length}개
            </p>
            <p className="text-text-secondary mt-0.5 text-sm">
              초대코드 {MOCK_GROUP_META.inviteCode}
            </p>
          </div>
        </div>

        {/* 그룹 정보 수정 모달 */}
        <GroupInfoEditModal
          isOpen={isEditGroupInfoOpen}
          groupInfo={groupInfo}
          onClose={() => setIsEditGroupInfoOpen(false)}
          onSave={handleSaveGroupInfo}
        />

        {/* 플레이리스트 편집 모달 */}
        <PlaylistEditModal
          isOpen={isEditPlaylistsOpen}
          addedPlaylists={playlists}
          availablePlaylists={availablePlaylists}
          onClose={() => setIsEditPlaylistsOpen(false)}
          onSave={handleSavePlaylists}
        />

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
