'use client';

import { type Ref, useImperativeHandle, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { type YouTubeEvent, type YouTubeProps } from 'react-youtube';

import { usePlayerStore } from '@/providers/player-store-provider';

export type PlaylistPlayerHandle = {
  play: () => void;
  pause: () => void;
  loadVideo: (videoId: string) => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
};

export default function PlaylistPlayer({
  videoId,
  autoPlay,
  onEnded,
  ref,
}: {
  videoId: string;
  autoPlay: boolean;
  onEnded: () => void;
  ref?: Ref<PlaylistPlayerHandle>;
}) {
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const playerRef = useRef<YouTubeEvent['target'] | null>(null);

  // 트랙 전환은 videoId prop이 아니라 loadVideo()로 직접 처리한다.
  // prop 변경 → 리렌더 경로에 의존하면 백그라운드 탭에서 커밋이 지연되며 재생 명령도 함께 늦어짐.
  const [initialVideoId] = useState(videoId);

  const opts: YouTubeProps['opts'] = {
    height: '1',
    width: '1',
    playerVars: {
      autoplay: autoPlay ? 1 : 0,
    },
  };

  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.playVideo(),
    pause: () => playerRef.current?.pauseVideo(),
    loadVideo: (id) => playerRef.current?.loadVideoById(id),
    seekTo: (seconds) => playerRef.current?.seekTo(seconds, true),
    getCurrentTime: () => playerRef.current?.getCurrentTime() ?? 0,
    getDuration: () => playerRef.current?.getDuration() ?? 0,
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
      videoId={initialVideoId}
      opts={opts}
      onReady={handleReady}
      onStateChange={handleStateChange}
      onEnd={onEnded}
      className="pointer-events-none fixed bottom-0 left-0 h-px w-px opacity-0"
    />
  );
}
