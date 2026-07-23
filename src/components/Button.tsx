'use client';

import clsx from 'clsx';
import { type ComponentPropsWithoutRef } from 'react';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Button({
  children,
  onClick = () => console.log('click'),
  size = 'md',
  isDisabled,
  variant = 'primary',
  className,
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  // ComponentPropsWithoutRef == 이컴포넌트 태그가 받을 수 있는 모든 속성 중 ref만 빼고 button테그의 속성을 사용한다.
  children: ReactNode;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  isDisabled: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}) {
  const button = twMerge(
    clsx(
      'w-full rounded-3xl text-base font-bold transition-all',
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
    <button
      className={`${button} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </button>
  );
}
