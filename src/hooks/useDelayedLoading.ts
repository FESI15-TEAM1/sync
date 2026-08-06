import { useEffect, useState } from 'react';

// 로딩이 delay(ms)보다 오래 지속될 때만 true를 반환해 짧은 로딩의 깜빡임을 방지
export function useDelayedLoading(isLoading: boolean, delay = 200) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => setShowLoading(true), delay);
    return () => {
      clearTimeout(timer);
      setShowLoading(false);
    };
  }, [isLoading, delay]);

  return showLoading;
}
