'use client';

import SpeakerMuteIcon from '@/assets/icons/speaker-mute.svg';
import SpeakerWaveIcon from '@/assets/icons/speaker-wave.svg';

export default function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: {
  /** 0~100 사이의 볼륨 */
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}) {
  // 음소거 중에는 저장된 볼륨과 상관없이 0으로 보여야 실제 들리는 소리와 맞는다.
  const displayVolume = isMuted ? 0 : volume;

  return (
    <div className="mt-2 flex w-full max-w-32 items-center gap-2">
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? '음소거 해제' : '음소거'}
        aria-pressed={isMuted}
        className="text-text-secondary hover:text-text-primary focus-visible:outline-primary shrink-0 cursor-pointer rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {isMuted ? (
          <SpeakerMuteIcon className="text-text-primary size-5" />
        ) : (
          <SpeakerWaveIcon className="text-text-primary size-5" />
        )}
      </button>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={displayVolume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}
        aria-label="볼륨"
        // 채워진 구간만 배경 그라디언트로 칠하고, 나머지 트랙은 진행바와 같은 색으로 둔다.
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${displayVolume}%, var(--color-bg-primary) ${displayVolume}%)`,
        }}
        className="focus-visible:outline-primary h-1 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
      />
    </div>
  );
}
