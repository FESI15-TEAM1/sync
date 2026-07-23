import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function UserIcon({
  length,
  index,
}: {
  length: number;
  index: number;
}) {
  const iconStyle = twMerge(
    clsx(
      'bg-input border-border flex size-8 items-center justify-center rounded-full border-1',
    ),
  );
  return <div className={iconStyle} style={{ zIndex: length - index }}></div>;
}
