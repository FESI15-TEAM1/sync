'use client';

import { useEffect, useRef, useState } from 'react';

import Button from '@/components/Button';
import KebabModal from '@/components/domain/KebabModal';

type Playlist = {
  id: number;
  title: string;
  songCount: number;
};

type ProfileProps = {
  profileId: number;
  nickname: string;
  email: string;
  bio: string;
  playlistCount: number;
  followerCount: number;
  followingCount: number;
};

const MOCK_PROFILE: ProfileProps = {
  profileId: 1,
  nickname: 'JPOP의 신',
  email: 'test@test.com',
  bio: '자기 소개입니다',
  playlistCount: 14,
  followerCount: 10,
  followingCount: 5,
};

const MOCK_PLAYLISTS: Playlist[] = [
  { id: 1, title: '비 오는 날 감성', songCount: 10 },
  { id: 2, title: '헤비로터', songCount: 20 },
  { id: 3, title: '새벽 드라이브', songCount: 30 },
];

export default function Profile({
  profileId,
  nickname,
  email,
  bio,
  playlistCount,
  followerCount,
  followingCount,
}: ProfileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  console.log('profile 수정', profileId);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-end">
          <div className="relative" ref={menuRef}></div>
          {/* <KebabModal /> */}
        </div>
      </div>
    </div>
  );
}
