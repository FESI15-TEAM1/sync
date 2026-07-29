'use client';

import { type Ref, useImperativeHandle, useRef } from 'react';
import type { YouTubeEvent, YouTubeProps } from 'react-youtube';
import YouTube from 'react-youtube';

import { usePlayerStore } from '@/providers/player-store-provider';

const opts: YouTubeProps['opts'] = {
  height: '0',
  width: '0',
  playerVars: {
    autoplay: 1,
  },
};

export type PlaylistPlayerHandle = {
  play: () => void;
  pause: () => void;
};

export default function PlaylistPlayer({
  videoId,
  onEnded,
  ref,
}: {
  videoId: string;
  onEnded: () => void;
  ref?: Ref<PlaylistPlayerHandle>;
}) {
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const playerRef = useRef<YouTubeEvent['target'] | null>(null);

  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.playVideo(),
    pause: () => playerRef.current?.pauseVideo(),
  }));

  const handleReady = (e: YouTubeEvent<number>) => {
    playerRef.current = e.target;
  };

  const handleStateChange = (e: YouTubeEvent<number>) => {
    playerRef.current = e.target;

    if (e.data === 1) setIsPlaying(true);
    else if (e.data === 2) setIsPlaying(false);
  };

  return (
    <YouTube
      videoId={videoId}
      opts={opts}
      onReady={handleReady}
      onStateChange={handleStateChange}
      onEnd={onEnded}
    />
  );
}
