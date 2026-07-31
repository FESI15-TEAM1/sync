'use client';

import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import { type InputHTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactNode;
};
// 인풋 스타일 공유 사용!
export const fieldStyle = twMerge(
  clsx(
    'border-border bg-bg-card placeholder:text-text-secondary w-full rounded-md border px-3 py-2 text-base text-white focus:outline-none',
  ),
);

export default function Input({
  type = 'text',
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative min-w-0 flex-1">
      <input
        {...props}
        type={type}
        className={twMerge(fieldStyle, className)}
      />
    </div>
  );
}
