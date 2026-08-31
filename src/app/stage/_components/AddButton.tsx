'use client';

import { useRouter } from 'next/navigation';

import { useGetMyPlayroomList } from '@/app/stage/_hooks/useGetMyPlayroomList';
import ConfirmModal from '@/components/domain/ConfirmModal';
import IconButton from '@/components/IconButton';
import { MY_PLAYROOM_MAX_COUNT } from '@/constants/playroom';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useUserStore } from '@/providers/user-store-provider';

export default function AddButton() {
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.isLoading);

  const router = useRouter();

  // 개설 상한 확인용. 회원일 때만 요청하며, 목록 뷰와 쿼리 키를 공유합니다.
  const { playrooms, isFetching: isMyPlayroomsFetching } =
    useGetMyPlayroomList();

  const loginRequiredModal = useConfirmModal({
    onConfirm: () => {
      loginRequiredModal.close();
      router.push('/login');
    },
  });
  // 확인 버튼만 있는 안내 모달이라 확인은 닫기와 같습니다.
  const limitReachedModal = useConfirmModal();

  const handleDirectToCreate = () => {
    // 비회원은 로그인 요구 모달을 먼저 띄웁니다.
    if (!user) {
      loginRequiredModal.open();
      return;
    }

    // 목록 조회에 실패하면 개수를 알 수 없으므로 막지 않고 넘깁니다(생성 시 서버가 거절).
    if (playrooms && playrooms.length >= MY_PLAYROOM_MAX_COUNT) {
      limitReachedModal.open();
      return;
    }

    router.push('/playroom/add');
  };

  return (
    <>
      <IconButton
        variants="primary"
        size="lg"
        className="disabled:bg-disabled fixed right-5 bottom-5 z-10 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleDirectToCreate}
        // 세션 확인 전에는 비회원 여부를, 목록을 다시 받아오는 동안에는 최신 개설 개수를 알 수 없으므로 버튼을 비활성화합니다.
        // (캐시가 있는 백그라운드 재조회에서는 isLoading 이 false 라 isFetching 으로 판정합니다.)
        disabled={isLoading || isMyPlayroomsFetching}
        aria-label="플레이룸 생성 버튼"
      >
        <span className="text-3xl text-white">+</span>
      </IconButton>

      {/* 비회원 접근 로그인 안내 모달 */}
      <ConfirmModal
        {...loginRequiredModal.modalProps}
        title="로그인이 필요합니다"
        description={
          <>
            플레이룸을 만들려면 로그인이 필요합니다.
            <br /> 로그인 페이지로 이동하시겠습니까?
          </>
        }
        confirmLabel="로그인"
      />

      {/* 개설 상한 도달 안내 모달 */}
      <ConfirmModal
        {...limitReachedModal.modalProps}
        title="최대 생성 가능 개수에 도달하였습니다"
        description={
          <>
            플레이룸은 최대 {MY_PLAYROOM_MAX_COUNT}개까지 만들 수 있습니다.
            <br /> 기존 플레이룸을 닫은 뒤 다시 시도해주세요.
          </>
        }
        hasCancel={false}
      />
    </>
  );
}
