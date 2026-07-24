'use client';

import { useEffect, useRef, useState } from 'react';

import Button from '@/components/ui/button';

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
  const [selectedPlaylistIds, setSelectedPlaylistId] = useState<string[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
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

    setSelectedPlaylistId((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
      <section className="flex items-start gap-4"></section>
    </main>
  );
}
