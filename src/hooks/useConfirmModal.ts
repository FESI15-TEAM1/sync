'use client';

import { useState } from 'react';

import { type ConfirmModalProps } from '@/components/domain/ConfirmModal';

type UseConfirmModalOptions<T> = {
  /**
   * 확인 버튼을 눌렀을 때 실행합니다. `open(target)` 으로 넘긴 값을 그대로 받습니다.
   * 넘기지 않으면 확인은 닫기와 같게 동작합니다(단순 안내용).
   */
  onConfirm?: (target: T) => void;
  // 확인 동작이 진행 중인지. 진행 중에는 사용자 조작으로 닫거나 재확인하지 못하게 합니다.
  isConfirming?: boolean;
  errorMessage?: string | null;
  // 열고 닫을 때마다 호출됩니다. 지난 시도의 에러를 지우는 용도입니다.
  onReset?: () => void;
};

type UseConfirmModalReturn<T> = {
  isOpen: boolean;
  // 열려 있는 대상. 대상 없이 여는 모달이면 항상 `null` 입니다.
  target: T | null;
  open: (target: T) => void;
  /**
   * 코드에서 직접 닫습니다(뮤테이션 성공 콜백 등).
   * 사용자 조작으로 닫는 경로는 `modalProps.onClose` 가 따로 막아 주므로 여기서는 막지 않습니다.
   */
  close: () => void;
  /**
   * `ConfirmModal` 에 그대로 펼쳐 넘깁니다.
   * 문구·버튼 성격처럼 화면마다 다른 props 는 호출부에서 이어 붙입니다.
   */
  modalProps: Pick<
    ConfirmModalProps,
    'isOpen' | 'isConfirming' | 'errorMessage' | 'onConfirm' | 'onClose'
  >;
};

/**
 * `ConfirmModal` 의 열림 상태와 확인/닫기 규칙을 함께 들고 있는 훅입니다.
 *
 * 확인 모달은 화면마다 "열 때 지난 에러를 지우고, 처리 중에는 닫히지 않으며,
 * 처리 중 재확인을 막는다"는 규칙을 똑같이 반복하므로 여기에 모아 둡니다.
 * 강퇴·제거처럼 대상이 있는 모달은 `useConfirmModal<Member>()` 로 대상 타입을 주고
 * `open(member)` 로 열면, 확인 시점에 그 대상을 `onConfirm` 으로 되돌려받습니다.
 *
 * 성공 시 닫는 시점은 화면마다 다르므로(이동하며 닫지 않는 경우도 있습니다)
 * 훅이 자동으로 닫지 않습니다. 뮤테이션 성공 콜백에서 `close()` 를 부르세요.
 */
export function useConfirmModal<T = void>({
  onConfirm,
  isConfirming = false,
  errorMessage,
  onReset,
}: UseConfirmModalOptions<T> = {}): UseConfirmModalReturn<T> {
  // 대상이 없는 모달은 target 이 undefined 라, 열림 여부는 한 겹 감싼 객체로 구분합니다.
  const [opened, setOpened] = useState<{ target: T } | null>(null);

  const open = (target: T) => {
    if (isConfirming) return;

    onReset?.();
    setOpened({ target });
  };

  const close = () => {
    onReset?.();
    setOpened(null);
  };

  const handleDismiss = () => {
    // 처리가 끝나기 전에 모달이 사라지면 결과를 알릴 곳이 없으므로 닫지 않습니다.
    if (isConfirming) return;

    close();
  };

  const handleConfirm = () => {
    if (isConfirming || !opened) return;

    if (!onConfirm) {
      close();
      return;
    }

    onConfirm(opened.target);
  };

  return {
    isOpen: opened !== null,
    target: opened ? opened.target : null,
    open,
    close,
    modalProps: {
      isOpen: opened !== null,
      isConfirming,
      errorMessage,
      onConfirm: handleConfirm,
      onClose: handleDismiss,
    },
  };
}
