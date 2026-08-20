'use client';

import { useRouter } from 'next/navigation';
import { type ComponentPropsWithoutRef } from 'react';

import BackIcon from '@/assets/icons/chevron-left.svg';

import IconButton from '../IconButton';

export default function BackButton({
  fallbackUrl = '/',
  staticUrl,
  onBeforeNavigate,
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  fallbackUrl?: string;
  staticUrl?: string;
  /** 이동 직전에 호출됩니다. `false` 를 반환하면 이동하지 않습니다. */
  onBeforeNavigate?: () => boolean;
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBeforeNavigate && !onBeforeNavigate()) return;

    if (staticUrl) {
      router.push(staticUrl);
      return;
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace(fallbackUrl);
    }
  };

  return (
    <>
      <IconButton {...props} size="sm" onClick={handleBack}>
        <BackIcon fill="white" />
      </IconButton>
    </>
  );
}
