'use client';

import { type PointerEvent } from 'react';

export default function PlayProgressBar({
  currentTime,
  duration,
  onSeek,
}: {
  /** 현재 재생 위치(초) */
  currentTime: number;
  /** 트랙 전체 길이(초). 플레이어가 준비되기 전에는 0 입니다. */
  duration: number;
  /** 없으면 탐색이 비활성화됩니다. 재생 컨트롤은 방장만 가능하기 때문입니다. */
  onSeek?: (time: number) => void;
}) {
  const formatTime = (t: number) => {
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressBarWidth = duration
    ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
    : 0;

  // 플레이어가 준비되기 전에는 길이를 몰라 클릭 지점을 초로 환산할 수 없다.
  const isSeekable = onSeek !== undefined && duration > 0;

  const handleSeek = (e: PointerEvent<HTMLDivElement>) => {
    if (!isSeekable) return;

    const { left, width } = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - left) / width, 0), 1);

    onSeek(ratio * duration);
  };

  return (
    <div className="mt-2 w-full max-w-[60%] lg:max-w-[80%]">
      {/* 막대가 얇아 클릭하기 어려우므로, 세로 여백을 준 래퍼가 포인터 이벤트를 받는다.
          가로 폭은 막대와 같으므로 위치 계산에는 영향을 주지 않는다. */}
      <div
        className={`-my-2 py-2 ${isSeekable ? 'cursor-pointer' : ''}`}
        onPointerDown={(e) => {
          if (!isSeekable) return;
          // 드래그가 막대 밖으로 나가도 계속 추적되도록 포인터를 붙잡는다.
          e.currentTarget.setPointerCapture(e.pointerId);
          handleSeek(e);
        }}
        onPointerMove={(e) => {
          // 버튼을 누른 채 움직일 때만 탐색한다.
          if (e.buttons !== 1) return;
          handleSeek(e);
        }}
      >
        <div className="bg-bg-primary h-1 w-full rounded-full">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${progressBarWidth}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-text-secondary text-xs">
          {formatTime(currentTime)}
        </span>
        <span className="text-text-secondary text-xs">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
