'use client';

import { useEffect, useState } from 'react';

const DOT_COUNT = 3;
const DOT_INTERVAL_MS = 1000;

/** 방장의 재생을 기다리는 동안 점이 1초마다 하나씩 늘었다가 초기화되는 문구. */
export default function WaitingDots() {
  const [visibleDotCount, setVisibleDotCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleDotCount((count) => (count + 1) % (DOT_COUNT + 1));
    }, DOT_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex items-center gap-1">
      w a i t i n g
      {Array.from({ length: visibleDotCount }, (_, index) => (
        <span key={index}>.</span>
      ))}
    </span>
  );
}
