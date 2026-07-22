'use client';

import clsx from 'clsx';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Button({
  children,
  onClick = () => console.log('click'),
  size = 'md',
  isDisabled,
  variant = 'primary',
}: {
  children: ReactNode;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  isDisabled: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}) {
  const button = twMerge(
    clsx(
      'w-full max-w-96 rounded-3xl text-base font-bold transition-all',
      // 버튼 크기 (size)
      {
        'px-3 py-1 text-sm': size === 'sm',
        'px-4 py-2 text-base': size === 'md',
        'px-6 py-3 text-lg': size === 'lg',
      },
      // 버튼타입 기본 / outline 팔로우 버튼
      {
        'bg-primary text-text-primary hover:bg-secondary':
          variant === 'primary',
        'border-2 border-[#88888] text-[#595959] enabled:hover:border-text-primary enabled:hover:text-text-primary':
          variant === 'outline',
      },
      // disabled
      {
        'cursor-pointer': !isDisabled,
        'disabled:bg-disabled disabled:text-text-secondary cursor-not-allowed':
          isDisabled,
      },
    ),
  );

  return (
    <button className={button} onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
}
