'use client';

import { useEffect, useRef, useState } from 'react';

import MoreIcon from '@/assets/icons/more.svg';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';

type Playlist = {
  id: string;
  title: string;
  songCount: number;
};

type GroupDetailProps = {
  groupId: string;
  isLeader?: boolean;
};

const MOCK_GROUP = {
  name: '인디밴드 러버스',
  memberCount: 32,
  playlistCount: 14,
  inviteCode: 'IN9X2K',
};

const MOCK_PLAYLISTS: Playlist[] = [
  { id: '1', title: '유저3의 플레이', songCount: 5 },
  { id: '2', title: '명한이 리스트', songCount: 10 },
  { id: '3', title: '비오는날 째즈맨', songCount: 15 },
  { id: '4', title: '내 플레이리스트', songCount: 12 },
];

export default function GroupDetail({
  groupId,
  isLeader = false,
}: GroupDetailProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaylistEditing, setIsPlaylistEditing] = useState(false);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
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
    setIsPlaylistEditing(true);
  };

  const togglePlaylist = (id: string) => {
    if (!isPlaylistEditing) return;

    setSelectedPlaylistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSavePlaylists = () => {
    console.log('Save playlists', selectedPlaylistIds);
    setIsPlaylistEditing(false);
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
              {isLeader && (
                <>
                  <IconButton
                    size="sm"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    <MoreIcon />
                  </IconButton>
                  {isMenuOpen && (
                    <div className="absolute top-8 right-0 w-40 rounded-lg bg-zinc-800 p-2">
                      <div
                        className="cursor-pointer px-4 py-3 hover:bg-zinc-700"
                        onClick={handleEditGroupInfo}
                      >
                        그룹 정보 수정
                      </div>
                      <div
                        className="cursor-pointer px-4 py-3 hover:bg-zinc-700"
                        onClick={handleEditPlaylists}
                      >
                        플레이리스트 편집
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-text-secondary mt-1 text-sm">
            멤버 {MOCK_GROUP.memberCount}명 · 플레이리스트{' '}
            {MOCK_GROUP.playlistCount}개
          </p>
          <p className="text-text-secondary mt-0.5 text-sm">
            초대코드 {MOCK_GROUP.inviteCode}
          </p>
        </div>
      </section>

      {!isLeader ? (
        <Button
          variant="primary"
          size="md"
          isDisabled={false}
          onClick={handleJoin}
        >
          참여하기
        </Button>
      ) : null}

      {isPlaylistEditing && (
        <Button
          variant="primary"
          size="md"
          isDisabled={selectedPlaylistIds.length === 0}
          onClick={handleSavePlaylists}
        >
          선택 완료
        </Button>
      )}

      <section>
        <ul className="grid grid-cols-2 gap-3">
          {MOCK_PLAYLISTS.map((playlist) => {
            const isSelected = selectedPlaylistIds.includes(playlist.id);

            return (
              <li key={playlist.id} className="relative">
                <button
                  type="button"
                  onClick={() => togglePlaylist(playlist.id)}
                  aria-pressed={isPlaylistEditing ? isSelected : undefined}
                  className="bg-bg-card flex w-full flex-col gap-2 rounded-2xl p-3 text-left"
                >
                  <div
                    className="bg-input aspect-square w-full rounded-xl"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-text-primary truncate text-sm font-bold">
                      {playlist.title}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {playlist.songCount}곡
                    </p>
                  </div>
                </button>
                {isPlaylistEditing && isSelected && (
                  <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-[rgba(0,0,0,50%)] after:block after:text-white after:content-["selected"]' />
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
