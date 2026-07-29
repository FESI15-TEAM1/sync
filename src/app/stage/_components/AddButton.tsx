'use client';

import { useRouter } from 'next/navigation';

import IconButton from '@/components/IconButton';

export default function AddButton() {
  const router = useRouter();

  const handleDrirectToCreate = () => {
    router.push('/playroom/add');
  };

  return (
    <>
      <IconButton
        variants="primary"
        size="lg"
        className="fixed right-5 bottom-5 z-10"
        onClick={handleDrirectToCreate}
        aria-label="플레이룸 생성 버튼"
      >
        <span className="text-3xl text-white">+</span>
      </IconButton>
    </>
  );
}
