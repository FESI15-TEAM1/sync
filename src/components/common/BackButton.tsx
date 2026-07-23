'use client';

import { useRouter } from 'next/navigation';
import { type ComponentPropsWithoutRef } from 'react';

import BackIcon from '@/assets/icons/chevron-left.svg';

import IconButton from '../IconButton';

export default function BackButton({
  fallbackUrl = '/',
  ...props
}: ComponentPropsWithoutRef<'button'> & {
  fallbackUrl?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
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
