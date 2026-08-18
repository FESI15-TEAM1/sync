'use client';

import Image from 'next/image';
import { type PointerEvent, useEffect, useState } from 'react';

import PauseIcon from '@/assets/icons/pause.svg';
import PlayIcon from '@/assets/icons/play.svg';
import SkipNextIcon from '@/assets/icons/skip-next.svg';
import SkipPreviousIcon from '@/assets/icons/skip-previous.svg';
import SpeakerMuteIcon from '@/assets/icons/speaker-mute.svg';
import SpeakerWaveIcon from '@/assets/icons/speaker-wave.svg';
import StopIcon from '@/assets/icons/stop.svg';
import defaultImg from '@/assets/images/default.png';
import IconButton from '@/components/IconButton';
import { type CurrentTrack } from '@/stores/player-store';

const formatTime = (time: number) => {
  if (!Number.isFinite(time) || time < 0) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function PlaylistPlayerBar({
  track,
  isVisible,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  onTogglePlay,
  onPrevious,
  onNext,
  onStop,
  onSeek,
  onVolumeChange,
  onToggleMute,
}: {
  track: CurrentTrack;
  isVisible: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(isVisible));
    return () => cancelAnimationFrame(id);
  }, [isVisible]);

  const handleSeek = (e: PointerEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      Math.max((e.clientX - rect.left) / rect.width, 0),
      1,
    );
    onSeek(ratio * duration);
  };

  return (
    <div
      className={`bg-bg-card border-border fixed bottom-0 left-0 z-40 w-full border-t transition-transform duration-300 lg:pl-64 ${shown ? 'translate-y-0' : 'pointer-events-none translate-y-full'}`}
    >
      <div
        className="bg-bg-primary h-1 w-full cursor-pointer"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handleSeek(e);
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return;
          handleSeek(e);
        }}
      >
        <div
          className="bg-primary h-1 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Image
            src={track.thumbnail || defaultImg}
            width={44}
            height={44}
            alt="현재 재생중인 트랙 썸네일"
            className="shrink-0 rounded-lg"
          />
          <div className="min-w-0">
            <p className="text-text-primary truncate text-sm font-bold">
              {track.title}
            </p>
            <p className="text-text-secondary truncate text-xs">
              {track.artist}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <IconButton size="md" onClick={onPrevious} title="이전곡">
              <SkipPreviousIcon />
            </IconButton>
            <IconButton size="md" onClick={onTogglePlay} title="재생/일시정지">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </IconButton>
            <IconButton size="md" onClick={onNext} title="다음곡">
              <SkipNextIcon />
            </IconButton>
            <IconButton size="md" onClick={onStop} title="정지">
              <StopIcon />
            </IconButton>
          </div>
          <span className="text-text-secondary text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex flex-1 justify-end">
          <div className="flex items-center gap-2 rounded-full px-3 py-1.5">
            <IconButton
              size="md"
              onClick={onToggleMute}
              title={isMuted ? '음소거 해제' : '음소거'}
            >
              {isMuted || volume === 0 ? (
                <SpeakerMuteIcon />
              ) : (
                <SpeakerWaveIcon />
              )}
            </IconButton>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              aria-label="볼륨"
              className="accent-primary bg-bg-card h-1 w-20 cursor-pointer"
            />
            <span className="text-text-secondary w-8 shrink-0 text-right text-xs">
              {isMuted ? 0 : volume}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
