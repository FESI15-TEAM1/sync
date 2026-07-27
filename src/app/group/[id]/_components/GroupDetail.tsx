'use client';

import { useEffect, useRef, useState } from 'react';

import MoreIcon from '@/assets/icons/more.svg';
import Button from '@/components/Button';
import PlaylistCard from '@/components/domain/PlaylistCard';
import IconButton from '@/components/IconButton';

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
    subtitle: 'ㄹㅇ좋음',
    trackCount: 18,
  },
  {
    id: '2',
    title: 'Midnight Rain',
    subtitle: 'Aria Chen',
    trackCount: 12,
  },
];

const MOCK_AVAILABLE_PLAYLISTS: EditablePlaylist[] = [
  { id: '3', title: 'jpop', subtitle: 'ㄹㅇ좋음', trackCount: 20 },
  {
    id: '4',
    title: '습할때 듣는노래',
    subtitle: 'Aria Chen',
    trackCount: 15,
  },
];

export default function GroupDetail({
  groupId,
  isLeader = false,
  isJoined = false,
}: GroupDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [playlists, setPlaylists] =
    useState<EditablePlaylist[]>(MOCK_ADDED_PLAYLISTS);
  const [availablePlaylists, setAvailablePlaylists] = useState<
    EditablePlaylist[]
  >(MOCK_AVAILABLE_PLAYLISTS);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleJoin = () => {
    console.log('Join group', groupId);
  };

  const handleEditGroupInfo = () => {
    setIsMenuOpen(false);
    console.log('Edit group info', groupId);
  };

  const handleEditPlaylists = () => {
    setIsMenuOpen(false);
    setIsPlaylistModalOpen(true);
  };

  const handleLeaveGroup = () => {
    setIsMenuOpen(false);
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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
      <section className="flex items-start gap-4">
        <div className="bg-input size-20 shrink-0 rounded-2xl" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-text-primary text-xl font-bold">
              {MOCK_GROUP.name}
            </h1>
            <div className="relative shrink-0" ref={menuRef}>
              {(isLeader || isJoined) && (
                <>
                  <IconButton
                    size="sm"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    <MoreIcon className="text-white" />
                  </IconButton>
                  {isMenuOpen && (
                    <div className="absolute top-8 right-0 w-max min-w-40 rounded-lg bg-zinc-800 p-2">
                      {isLeader ? (
                        <>
                          <div
                            className="cursor-pointer px-4 py-3 whitespace-nowrap text-white hover:bg-zinc-700"
                            onClick={handleEditGroupInfo}
                          >
                            그룹 정보 수정
                          </div>
                          <div
                            className="cursor-pointer px-4 py-3 whitespace-nowrap text-white hover:bg-zinc-700"
                            onClick={handleEditPlaylists}
                          >
                            플레이리스트 편집
                          </div>
                        </>
                      ) : (
                        <div
                          className="cursor-pointer px-4 py-3 whitespace-nowrap text-red-500 hover:bg-zinc-700"
                          onClick={handleLeaveGroup}
                        >
                          그룹 탈퇴하기
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            멤버 {MOCK_GROUP.memberCount}명 · 플레이리스트 {playlists.length}개
          </p>
          <p className="text-text-secondary mt-0.5 text-sm">
            초대코드 {MOCK_GROUP.inviteCode}
          </p>
        </div>
      </section>

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

      <section>
        <div className="grid grid-cols-2 items-center justify-items-center gap-1">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              trackCount={playlist.trackCount}
            />
          ))}
        </div>
      </section>

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
    </main>
  );
}
