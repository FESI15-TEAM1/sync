'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';

import GroupLeaveModal from './GroupLeaveModal';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

type GroupDetailProps = {
  groupId: string;
  isLeader?: boolean;
  isJoined?: boolean;
};

const MOCK_GROUP = {
  name: '인디밴드 러버스',
  memberCount: 32,
  playlistCount: 14,
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

export default function GroupDetail({
  groupId,
  isLeader = false,
  isJoined = false,
}: GroupDetailProps) {
  const router = useRouter();
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [playlists, setPlaylists] =
    useState<EditablePlaylist[]>(MOCK_ADDED_PLAYLISTS);
  const [availablePlaylists, setAvailablePlaylists] = useState<
    EditablePlaylist[]
  >(MOCK_AVAILABLE_PLAYLISTS);

  const handleJoin = () => {
    console.log('Join group', groupId);
  };

  const handleEditGroupInfo = () => {
    router.push(`/group/${groupId}/edit`);
  };

  const handleEditPlaylists = () => {
    setIsPlaylistModalOpen(true);
  };

  const handleLeaveGroup = () => {
    setIsLeaveModalOpen(true);
  };

  const handleConfirmLeave = () => {
    console.log('Leave group', groupId);
    setIsLeaveModalOpen(false);
  };

  const handleSavePlaylists = (nextPlaylists: EditablePlaylist[]) => {
    const nextIds = new Set(nextPlaylists.map((item) => item.id));
    const removed = playlists.filter((item) => !nextIds.has(item.id));
    const keptAvailable = availablePlaylists.filter(
      (item) => !nextIds.has(item.id),
    );

    setPlaylists(nextPlaylists);
    setAvailablePlaylists([...keptAvailable, ...removed]);
    setIsPlaylistModalOpen(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
      <div className="flex items-start gap-4">
        <div className="bg-input size-20 shrink-0 rounded-2xl" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-text-primary text-xl font-bold">
              {MOCK_GROUP.name}
            </h1>
            {(isLeader || isJoined) && (
              <KebabModal
                isLeader={isLeader}
                onEditGroupInfo={handleEditGroupInfo}
                onEditPlaylists={handleEditPlaylists}
                onLeaveGroup={handleLeaveGroup}
              />
            )}
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            멤버 {MOCK_GROUP.memberCount}명 · 플레이리스트 {playlists.length}개
          </p>
          <p className="text-text-secondary mt-0.5 text-sm">
            초대코드 {MOCK_GROUP.inviteCode}
          </p>
        </div>
      </div>

      {!isLeader && !isJoined ? (
        <Button
          variant="primary"
          size="md"
          isDisabled={false}
          onClick={handleJoin}
        >
          참여하기
        </Button>
      ) : null}

      <div>
        <div className="grid grid-cols-2 items-center justify-items-center gap-1">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              title={playlist.title}
              trackCount={playlist.trackCount}
            />
          ))}
        </div>
      </div>

      <PlaylistEditModal
        isOpen={isPlaylistModalOpen}
        addedPlaylists={playlists}
        availablePlaylists={availablePlaylists}
        onClose={() => setIsPlaylistModalOpen(false)}
        onSave={handleSavePlaylists}
      />

      <GroupLeaveModal
        isOpen={isLeaveModalOpen}
        groupName={MOCK_GROUP.name}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleConfirmLeave}
      />
    </div>
  );
}
