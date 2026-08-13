'use client';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Toggle({
  checked,
  onChange,
  className,
  checkedLabel = 'Public',
  uncheckedLabel = 'Private',
  ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  // 켜짐/꺼짐 상태 문구. 생략하면 공개여부 토글 기본값입니다.
  checkedLabel?: string;
  uncheckedLabel?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={twMerge(
        clsx(
          'relative h-8 w-28 shrink-0 cursor-pointer rounded-full p-1 transition-colors',
          checked ? 'bg-primary' : 'bg-disabled',
        ),
        className,
      )}
    >
      <span
        className={clsx(
          'absolute top-1 left-1 w-20 rounded-full bg-white py-1 text-center text-xs font-bold transition-transform',
          checked ? 'text-primary translate-x-6' : 'text-border translate-x-0',
        )}
      >
        {checked ? checkedLabel : uncheckedLabel}
      </span>
    </button>
  );
}
