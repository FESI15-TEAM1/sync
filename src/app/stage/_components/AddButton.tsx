'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useGetMyPlayroomList } from '@/app/stage/_hooks/useGetMyPlayroomList';
import IconButton from '@/components/IconButton';
import { MY_PLAYROOM_MAX_COUNT } from '@/constants/playroom';
import { useUserStore } from '@/providers/user-store-provider';

import LoginRequiredModal from './LoginRequiredModal';
import PlayroomLimitModal from './PlayroomLimitModal';

export default function AddButton() {
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);

  const router = useRouter();

  // 개설 상한 확인용. 회원일 때만 요청하며, 목록 뷰와 쿼리 키를 공유합니다.
  const { playrooms, isLoading: isMyPlayroomsLoading } = useGetMyPlayroomList(
    Boolean(user),
  );

  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [isLimitReachedOpen, setIsLimitReachedOpen] = useState(false);

  const handleDirectToCreate = () => {
    // 비회원은 로그인 요구 모달을 먼저 띄웁니다.
    if (!user) {
      setIsLoginRequiredOpen(true);
      return;
    }

    // 목록 조회에 실패하면 개수를 알 수 없으므로 막지 않고 넘깁니다(생성 시 서버가 거절).
    if (playrooms && playrooms.length >= MY_PLAYROOM_MAX_COUNT) {
      setIsLimitReachedOpen(true);
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
        // 세션 확인 전에는 비회원 여부를, 목록 조회 전에는 개설 개수를 알 수 없으므로 버튼을 비활성화합니다.
        disabled={isLoading || isMyPlayroomsLoading}
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

      {/* 개설 상한 도달 안내 모달 */}
      <PlayroomLimitModal
        isOpen={isLimitReachedOpen}
        onClose={() => setIsLimitReachedOpen(false)}
      />
    </>
  );
}
