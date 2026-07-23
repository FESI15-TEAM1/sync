import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export default function Badge({
  type,
  children,
}: {
  type: 'live' | 'genre';
  children?: ReactNode;
}) {
  const badgeStyles = twMerge(
    clsx('rounded-full py-0.2 px-3 text-xs font-semibold', {
      'bg-[rgba(241,109,109,20%)] text-[#f16d6d]': type === 'live',
      'border-border border-1 uppercase font-normal text-[10px] text-text-secondary':
        type === 'genre',
    }),
  );
  return (
    <span className={badgeStyles}>{type === 'live' ? 'LIVE' : children}</span>
  );
}
