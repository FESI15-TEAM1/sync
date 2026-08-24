'use client';

import clsx from 'clsx';
import type { ElementType } from 'react';
import { type ComponentPropsWithoutRef } from 'react';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type PolymorphicProps<C extends ElementType> = {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, 'as'>;

// next/link 같은 as 오버라이드는 disabled 속성을 해석하지 않아 isDisabled가 눌림을 막지 못하므로,
// as로 button이 아닌 요소를 지정하면 isDisabled 자체를 타입에서 금지합니다.
type ButtonOwnProps<C extends ElementType> = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
} & (C extends 'button' ? { isDisabled?: boolean } : { isDisabled?: never });

export default function Button<C extends ElementType = 'button'>({
  children,
  size = 'md',
  isDisabled,
  variant = 'primary',
  className,
  as,
  ...props
}: PolymorphicProps<C> & ButtonOwnProps<C>) {
  const Comp = as || 'button';
  const button = twMerge(
    clsx(
      'rounded-3xl text-base font-bold transition-all text-nowrap',
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
    <Comp
      className={twMerge(button, className)}
      disabled={isDisabled}
      {...props}
    >
      {children}
    </Comp>
  );
}
