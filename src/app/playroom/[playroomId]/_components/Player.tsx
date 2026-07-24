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
    <div className="bg-bg-card border-border flex flex-col items-center rounded-xl border-1 py-10">
      {/* thumbnail image */}
      <Image
        src={mookImage.src}
        alt=""
        width={100}
        height={100}
        className="rounded-2xl"
      />

      {/* song title */}
      <h2 className="mt-2 text-base font-bold text-white">{musicTitle}</h2>

      {/* song artist */}
      <p className="text-text-secondary mt-1 text-xs">{artist}</p>

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
