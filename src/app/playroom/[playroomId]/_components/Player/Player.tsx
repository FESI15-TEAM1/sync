'use client';

import Image from 'next/image';
import { useState } from 'react';

import mookImage from '@/assets/images/mook.jpg';

import Controller from './Controller';
import PlayProgressBar from './PlayProgressBar';

export default function Player({
  trackId,
  musicTitle,
  artist,
  thumbnail,
  currentTime,
  isPlaying,
  isHost,
}: {
  trackId: string;
  musicTitle: string;
  artist: string;
  thumbnail: string;
  currentTime: number;
  isPlaying: boolean;
  isHost: boolean;
}) {
  const [playStatus, setPlayStatus] = useState(isPlaying);

  const handlePlayPreviousTrack = () => {};
  const handlePlayPause = () => {
    setPlayStatus(!playStatus);
  };
  const handlePlayNextTrack = () => {};

  return (
    <div className="bg-bg-card border-border box-border flex flex-col items-center gap-2 rounded-xl border py-4 lg:gap-4 lg:py-8">
      {/* thumbnail image */}
      <Image
        src={mookImage.src}
        alt=""
        width={250}
        height={250}
        className="aspect-square max-w-[100px] rounded-2xl lg:max-w-none"
      />

      {/* song title */}
      <h2 className="text-base font-bold text-white">{musicTitle}</h2>

      {/* song artist */}
      <p className="text-text-secondary text-xs">{artist}</p>

      {/* play progress bar */}
      <PlayProgressBar currentTime={136} durations={'PT3M33S'} />

      {/* controller panel */}
      <Controller
        playNextTrack={handlePlayNextTrack}
        playPreviousTrack={handlePlayPreviousTrack}
        playPause={handlePlayPause}
        isPlaying={playStatus}
        isHost={isHost}
      />

      {/* control access notice */}
      <span className="text-text-secondary text-center text-xs">
        재생 컨트롤은 방장만 가능해요
      </span>
    </div>
  );
}
