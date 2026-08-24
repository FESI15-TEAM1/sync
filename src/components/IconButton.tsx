import { clsx } from 'clsx';
import type { ElementType } from 'react';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import type { PolymorphicProps } from './Button';

export default function IconButton<C extends ElementType = 'button'>({
  children,
  variants,
  size,
  className,
  as,
  ...props
}: PolymorphicProps<C> & {
  children: ReactNode; // 아이콘 컴포넌트를 받아옵니다
  variants?: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const Comp = as || 'button';
  const buttonStyle = clsx(
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
  );

  return (
    <>
      <Comp className={twMerge(buttonStyle, className)} {...props}>
        {children}
      </Comp>
    </>
  );
}
