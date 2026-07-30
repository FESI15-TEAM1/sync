'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import MoreIcon from '@/assets/icons/more.svg';
import IconButton from '@/components/IconButton';

type KebabModalProps = {
  children: ReactNode;
};

type KebabItemProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
};

function KebabModal({ children }: KebabModalProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative shrink-0" ref={menuRef}>
      <IconButton size="sm" onClick={() => setIsMenuOpen((prev) => !prev)}>
        <MoreIcon className="text-white" />
      </IconButton>

      {isMenuOpen && (
        <div
          className="absolute top-8 right-0 z-10 flex w-max min-w-40 flex-col rounded-lg bg-zinc-800 p-2"
          onClick={() => setIsMenuOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function KebabItem({ children, onClick, variant = 'default' }: KebabItemProps) {
  const textColor = variant === 'danger' ? 'text-red-500' : 'text-white';

  return (
    <button
      type="button"
      className={`w-full cursor-pointer px-4 py-3 text-left whitespace-nowrap ${textColor} hover:bg-zinc-700`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

KebabModal.Item = KebabItem;

export default KebabModal;
