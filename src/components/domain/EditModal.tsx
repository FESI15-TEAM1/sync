'use client';

import { useEffect, useRef, useState } from 'react';

import MoreIcon from '@/assets/icons/more.svg';
import IconButton from '@/components/IconButton';

type EditModalProps = {
  isLeader: boolean;
  onEditGroupInfo: () => void;
  onEditPlaylists: () => void;
  onLeaveGroup: () => void;
};

export default function EditModal({
  isLeader,
  onEditGroupInfo,
  onEditPlaylists,
  onLeaveGroup,
}: EditModalProps) {
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

  const handleEditGroupInfo = () => {
    setIsMenuOpen(false);
    onEditGroupInfo();
  };

  const handleEditPlaylists = () => {
    setIsMenuOpen(false);
    onEditPlaylists();
  };

  const handleLeaveGroup = () => {
    setIsMenuOpen(false);
    onLeaveGroup();
  };

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <IconButton size="sm" onClick={() => setIsMenuOpen((prev) => !prev)}>
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
    </div>
  );
}
