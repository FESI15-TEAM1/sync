import { cva, type VariantProps } from 'class-variance-authority';
import { type ReactNode } from 'react';

const badgeVariants = cva('rounded-full px-3 py-0.2 text-xs', {
  variants: {
    type: {
      live: 'font-semibold',
      genre:
        'border-border text-text-secondary border text-[10px] font-normal uppercase',
    },
    isLive: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      type: 'live',
      isLive: true,
      class: 'bg-[rgba(241,109,109,20%)] text-[#f16d6d]',
    },
    {
      // 방송 중이 아닐 때 — 빨간 LIVE 대신 회색으로
      type: 'live',
      isLive: false,
      class: 'bg-disabled/20 text-text-secondary',
    },
  ],
  defaultVariants: {
    type: 'live',
    isLive: false,
  },
});

export default function Badge({
  type,
  isLive,
  children,
}: VariantProps<typeof badgeVariants> & {
  children?: ReactNode;
}) {
  return (
    <span className={badgeVariants({ type, isLive })}>
      {type === 'live' ? 'LIVE' : children}
    </span>
  );
}
