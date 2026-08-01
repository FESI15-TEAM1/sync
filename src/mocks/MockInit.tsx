'use client';

import { useEffect } from 'react';

import { initMocks } from '@/mocks';

export default function MockInit() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      initMocks();
    }
  }, []);

  return null;
}
