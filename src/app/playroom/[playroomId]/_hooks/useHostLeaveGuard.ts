'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * 방장이 방을 떠나면 동기화가 끊기므로, 페이지를 벗어나려는 시도를 감지해 안내를 띄웁니다.
 *
 * 가로채는 경로는 셋입니다.
 * - 링크 클릭: document 캡처 단계에서 앵커 클릭을 잡습니다(`Link` 포함).
 * - 브라우저 뒤로가기: popstate 는 취소할 수 없으므로, 같은 URL 의 히스토리 항목을
 *   하나 심어 두고 뒤로가기를 한 번 흡수한 뒤 다시 심는 방식으로 되돌립니다.
 * - 새로고침·탭 닫기: beforeunload 로 브라우저 기본 확인창을 띄웁니다(문구는 지정 불가).
 *
 * 버튼처럼 앵커가 아닌 이동은 `requestLeave` 로 직접 거쳐야 합니다.
 */
export function useHostLeaveGuard(isEnabled: boolean) {
  const router = useRouter();

  const [isLeaveNoticeOpen, setIsLeaveNoticeOpen] = useState(false);

  // 안내에서 확인을 누른 뒤의 이동은 다시 가로채지 않습니다.
  const isLeaveConfirmedRef = useRef(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);
  // 히스토리 항목을 심어 뒀는지. 가드가 여러 번 켜졌다 꺼져도 하나만 유지합니다.
  const isSentinelPushedRef = useRef(false);

  // 앵커 클릭 가로채기
  useEffect(() => {
    if (!isEnabled) return;

    const handleClick = (event: MouseEvent) => {
      if (isLeaveConfirmedRef.current || event.defaultPrevented) return;
      // 새 탭으로 여는 조작은 이 페이지를 떠나지 않으므로 그대로 둡니다.
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;

      const url = new URL(anchor.href, window.location.href);
      // 외부 링크는 beforeunload 가, 같은 주소는 이동이 아니므로 여기서 다루지 않습니다.
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname + url.search ===
        window.location.pathname + window.location.search
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      pendingNavigationRef.current = () => {
        router.push(url.pathname + url.search + url.hash);
      };
      setIsLeaveNoticeOpen(true);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isEnabled, router]);

  // 브라우저 뒤로가기 가로채기
  useEffect(() => {
    if (!isEnabled) return;

    // 뒤로가기 한 번을 흡수할 항목을 심어 둡니다. 같은 URL 이라 화면은 그대로입니다.
    // 가드가 껐다 켜지거나 effect 가 다시 실행돼도 항목은 하나만 유지합니다.
    if (!isSentinelPushedRef.current) {
      window.history.pushState(window.history.state, '', window.location.href);
      isSentinelPushedRef.current = true;
    }

    const handlePopState = () => {
      if (isLeaveConfirmedRef.current) return;

      // 흡수한 만큼 다시 심어 두므로 개수는 그대로입니다.
      window.history.pushState(window.history.state, '', window.location.href);

      // 심어 둔 항목과 이 방 항목을 한 번에 건너뜁니다.
      const skipCount = isSentinelPushedRef.current ? 2 : 1;
      pendingNavigationRef.current = () => {
        window.history.go(-skipCount);
      };
      setIsLeaveNoticeOpen(true);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
    // 심어 둔 항목은 여기서 되돌리지 않습니다. 이 정리 함수는 가드가 꺼질 때뿐 아니라
    // 페이지를 실제로 떠나 언마운트될 때도 돌기 때문에, 되돌리면 방금 이동한 화면에서
    // 방으로 튕겨 돌아옵니다. 남은 항목은 같은 URL 이라 뒤로가기 한 번에 흡수됩니다.
  }, [isEnabled]);

  // 새로고침·탭 닫기
  useEffect(() => {
    if (!isEnabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isLeaveConfirmedRef.current) return;

      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEnabled]);

  /**
   * 앵커가 아닌 이동(버튼 등)을 거쳐 가는 입구입니다.
   * 그대로 이동해도 되면 `true`, 안내를 띄워 막았으면 `false` 를 돌려줍니다.
   */
  const requestLeave = (navigate: () => void) => {
    if (!isEnabled || isLeaveConfirmedRef.current) return true;

    pendingNavigationRef.current = navigate;
    setIsLeaveNoticeOpen(true);

    return false;
  };

  const confirmLeave = () => {
    const navigate = pendingNavigationRef.current;

    isLeaveConfirmedRef.current = true;
    pendingNavigationRef.current = null;
    setIsLeaveNoticeOpen(false);

    navigate?.();
  };

  const cancelLeave = () => {
    pendingNavigationRef.current = null;
    setIsLeaveNoticeOpen(false);
  };

  return { isLeaveNoticeOpen, requestLeave, confirmLeave, cancelLeave };
}
