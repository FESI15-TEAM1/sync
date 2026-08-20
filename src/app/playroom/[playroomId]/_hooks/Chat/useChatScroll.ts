import { type RefObject, useEffect, useState } from 'react';

// 최하단에서 이만큼(px) 이상 멀어지면 "최신 채팅으로" 버튼을 노출합니다.
const SCROLL_THRESHOLD = 200;

export function useChatScroll(containerRef: RefObject<HTMLElement | null>) {
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // flex-col-reverse 스크롤 컨테이너라 최하단이 scrollTop 0이고,
      // 위로 스크롤하면 음수로 내려갑니다.
      setIsScrolledUp(Math.abs(container.scrollTop) > SCROLL_THRESHOLD);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return { isScrolledUp, scrollToBottom };
}
