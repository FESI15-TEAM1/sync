'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
]
  .map((selector) => `${selector}:not([aria-hidden="true"])`)
  .join(',');

/**
 * 모달이 열려 있는 동안 키보드 포커스를 컨테이너 안에 가둡니다.
 * aria-modal만으로는 배경 요소로 Tab 이동이 막히지 않으므로 직접 제어합니다.
 *
 * 열릴 때 컨테이너 안 첫 요소로 포커스를 옮기고, 닫힐 때 이전 포커스를 되돌립니다.
 * 컨테이너에 `tabIndex={-1}`을 붙여야 포커스 가능한 요소가 하나도 없을 때(예: 처리 중이라
 * 모든 버튼이 비활성화된 상태) 포커스가 배경으로 빠지지 않습니다.
 */
export default function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;

    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusableElements = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.tabIndex >= 0 && el.offsetParent !== null);

    const focusable = getFocusableElements();

    (focusable[0] ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const elements = getFocusableElements();

      // 포커스 가능한 요소가 없으면 컨테이너 자신에 붙잡아 둡니다.
      if (elements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement;

      if (!(active instanceof HTMLElement) || !container.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    // 배경 요소가 Tab 기본 동작을 처리하기 전에 가로채야 하므로 캡처 단계에서 듣습니다.
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);

      // 이미 사라진 요소에는 포커스를 되돌리지 않습니다.
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}
