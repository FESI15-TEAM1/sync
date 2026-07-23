'use client';

import BackButton from '@/components/common/BackButton';
import IconButton from '@/components/IconButton';

export default function Player() {
  return (
    <>
      <BackButton />
      <IconButton
        size="md"
        onClick={() => console.log('clicked')}
        variants="primary"
      >
        <span className="text-lg text-white">+</span>
      </IconButton>
      <IconButton
        size="lg"
        onClick={() => console.log('clicked')}
        variants="primary"
      >
        <span className="text-3xl text-white">+</span>
      </IconButton>
    </>
  );
}
