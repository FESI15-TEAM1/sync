'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import More2Icon from '@/assets/icons/more2.svg';
import IconButton from '@/components/IconButton';

// 플레이리스트 카드 전용 케밥 메뉴(more2 아이콘, 카드 하단에 위치)
export default function PlaylistCardMenu({
  children,
}: {
  children: ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <IconButton
        size="sm"
        variants="secondary"
        aria-label="플레이리스트 메뉴"
        onClick={(e) => {
          e.preventDefault();
          setIsMenuOpen((prev) => !prev);
        }}
      >
        <More2Icon width={22} height={22} />
      </IconButton>

      {isMenuOpen && (
        <div
          className="absolute right-0 bottom-8 z-10 flex w-max min-w-40 flex-col rounded-lg bg-zinc-800 p-2"
          onClick={() => setIsMenuOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
