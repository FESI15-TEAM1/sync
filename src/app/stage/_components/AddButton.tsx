'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import IconButton from '@/components/IconButton';
import { useUserStore } from '@/providers/user-store-provider';

import LoginRequiredModal from './LoginRequiredModal';

export default function AddButton() {
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);

  const router = useRouter();

  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);

  const handleDirectToCreate = () => {
    // 비회원은 로그인 요구 모달을 먼저 띄웁니다.
    if (!user) {
      setIsLoginRequiredOpen(true);
      return;
    }

    router.push('/playroom/add');
  };

  const handleConfirmLogin = () => {
    setIsLoginRequiredOpen(false);
    router.push('/login');
  };

  return (
    <>
      <IconButton
        variants="primary"
        size="lg"
        className="fixed right-5 bottom-5 z-10 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleDirectToCreate}
        // 세션 확인 전에는 비회원 여부를 알 수 없으므로 버튼을 비활성화합니다.
        disabled={isLoading}
        aria-label="플레이룸 생성 버튼"
      >
        <span className="text-3xl text-white">+</span>
      </IconButton>

      {/* 비회원 로그인 요구 모달 */}
      <LoginRequiredModal
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
        onConfirm={handleConfirmLogin}
      />
    </>
  );
}
