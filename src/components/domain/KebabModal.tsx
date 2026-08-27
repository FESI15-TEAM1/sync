'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import MoreIcon from '@/assets/icons/more.svg';
import IconButton from '@/components/IconButton';

type KebabModalProps = {
  children: ReactNode;
  trigger?: ReactNode;
  triggerLabel?: string;
};

type KebabItemProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
};

function KebabModal({ children, trigger, triggerLabel }: KebabModalProps) {
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
      {trigger ? (
        <button
          type="button"
          aria-label={triggerLabel}
          className="cursor-pointer"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {trigger}
        </button>
      ) : (
        <IconButton size="sm" onClick={() => setIsMenuOpen((prev) => !prev)}>
          <MoreIcon className="text-white" />
        </IconButton>
      )}

      {isMenuOpen && (
        <div
          className="absolute top-full right-0 z-10 mt-2 flex w-max min-w-40 flex-col rounded-lg bg-zinc-800 p-2"
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
      onClick={(e) => {
        // Link 등 조상 요소로 클릭이 버블링되어 기본 동작(이동)이 발생하지 않도록 막습니다.
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </button>
  );
}

KebabModal.Item = KebabItem;

export default KebabModal;
