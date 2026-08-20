import { cva } from 'class-variance-authority';

export default function LiveHeartbeat({
  size = 'sm',
}: {
  size?: 'sm' | 'md' | 'lg';
}) {
  const dotSize = cva('rounded-full bg-red-500', {
    variants: {
      size: {
        sm: 'size-1',
        md: 'size-1.5',
        lg: 'size-2',
      },
    },
  });
  const heartbeatSize = cva(
    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform animate-ping rounded-full bg-red-400',
    {
      variants: {
        size: {
          sm: 'size-1.5',
          md: 'size-2',
          lg: 'size-2.5',
        },
      },
    },
  );
  return (
    <span
      className="relative inline-flex"
      title="라이브"
      role="img"
      aria-label="라이브 애니메이션 아이콘"
    >
      <span className={heartbeatSize({ size })}></span>
      <span className={dotSize({ size })}></span>
    </span>
  );
}
