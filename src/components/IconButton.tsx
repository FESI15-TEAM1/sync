import { clsx } from 'clsx';
import { type ReactNode } from 'react';
import { type ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

export default function IconButton({
  children,
  variants,
  onClick,
  size,
  className,
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  children: ReactNode; // 아이콘 컴포넌트를 받아옵니다
  variants?: 'primary' | 'secondary';
  onClick: () => void;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const buttonStyle = twMerge(
    clsx(
      'rounded-full flex justify-center items-center cursor-pointer',
      {
        'bg-primary': variants === 'primary',
        'bg-bg-card': variants === 'secondary',
      },
      {
        'size-6': size === 'sm',
        'size-8': size === 'md',
        'size-12': size === 'lg',
      },
    ),
  );

  return (
    <>
      <button
        className={`${buttonStyle} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    </>
  );
}
