'use client';

import { type Ref, useImperativeHandle, useRef, useState } from 'react';
import YouTube, { type YouTubeEvent, type YouTubeProps } from 'react-youtube';

export type YoutubePlayerHandle = {
  play: () => void;
  pause: () => void;
  /** 지정한 곡을 불러와 바로 재생한다. */
  loadVideo: (videoId: string, startSeconds?: number) => void;
  /** 지정한 곡을 불러오되 재생하지 않는다(방장이 일시정지 중일 때 따라가기용). */
  cueVideo: (videoId: string, startSeconds?: number) => void;
  seekTo: (seconds: number) => void;
  /** 음소거 재생은 자동재생 정책에 막히지 않으므로, 소리 없이라도 따라가야 할 때 쓴다. */
  mute: () => void;
  unMute: () => void;
  /** 0~100 사이의 볼륨. 음소거 상태에서는 값만 저장되고 소리는 나지 않는다. */
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  /** 유튜브 플레이어 상태 코드. -1(시작 전)·5(큐만 올림)에서는 seekTo 가 먹지 않는다. */
  getPlayerState: () => number;
  /** 현재 iframe 에 올라가 있는 곡. 마운트 시점의 곡이 그대로 남아 있을 수 있어 따로 추적한다. */
  getLoadedVideoId: () => string;
};

export default function YoutubePlayer({
  videoId,
  onPlayingChange,
  onReady,
  onEnded,
  ref,
}: {
  videoId: string;
  onPlayingChange: (isPlaying: boolean) => void;
  /** 플레이어가 명령을 받을 수 있게 된 시점. 이 전의 재생/탐색 명령은 조용히 무시된다. */
  onReady?: () => void;
  onEnded?: () => void;
  ref?: Ref<YoutubePlayerHandle>;
}) {
  const playerRef = useRef<YouTubeEvent['target'] | null>(null);

  // 트랙 전환은 videoId prop이 아니라 loadVideo()로 직접 처리한다.
  // prop 변경 → 리렌더 경로에 의존하면 백그라운드 탭에서 커밋이 지연되며 재생 명령도 함께 늦어짐.
  const [initialVideoId] = useState(videoId);
  const loadedVideoIdRef = useRef(initialVideoId);

  const opts: YouTubeProps['opts'] = {
    height: '1',
    width: '1',
    playerVars: {
      autoplay: 0,
    },
  };

  /**
   * 유튜브 플레이어는 iframe 으로 명령을 보내는데, 아직 iframe 이 붙지 않은 상태에서 명령을 보내면 예외를 던진다. 이때는 조용히 무시하고 false 를 돌려준다.
   */
  const runCommand = (command: (player: YouTubeEvent['target']) => void) => {
    const player = playerRef.current;
    if (!player) return false;

    try {
      command(player);
      return true;
    } catch {
      return false;
    }
  };

  const readValue = <T,>(
    read: (player: YouTubeEvent['target']) => T,
    fallback: T,
  ): T => {
    const player = playerRef.current;
    if (!player) return fallback;

    try {
      return read(player);
    } catch {
      return fallback;
    }
  };

  useImperativeHandle(ref, () => ({
    play: () => runCommand((player) => player.playVideo()),
    pause: () => runCommand((player) => player.pauseVideo()),
    // 명령이 실패하면 iframe 에는 이전 곡이 그대로 남으므로, 성공했을 때만 식별자를 갈아끼운다.
    // 먼저 갱신하면 동기화 쪽에서 곡이 이미 바뀐 줄 알고 엉뚱한 곡에 탐색·재생만 건다.
    loadVideo: (id, startSeconds) => {
      const isLoaded = runCommand((player) =>
        player.loadVideoById(id, startSeconds),
      );
      if (isLoaded) loadedVideoIdRef.current = id;
    },
    cueVideo: (id, startSeconds) => {
      const isCued = runCommand((player) =>
        player.cueVideoById(id, startSeconds),
      );
      if (isCued) loadedVideoIdRef.current = id;
    },
    seekTo: (seconds) => runCommand((player) => player.seekTo(seconds, true)),
    mute: () => runCommand((player) => player.mute()),
    unMute: () => runCommand((player) => player.unMute()),
    setVolume: (volume) => runCommand((player) => player.setVolume(volume)),
    getCurrentTime: () => readValue((player) => player.getCurrentTime(), 0),
    getDuration: () => readValue((player) => player.getDuration(), 0),
    getPlayerState: () => readValue((player) => player.getPlayerState(), -1),
    getLoadedVideoId: () => loadedVideoIdRef.current,
  }));

  const handleReady = (e: YouTubeEvent<number>) => {
    playerRef.current = e.target;
    onReady?.();
  };

  const handleStateChange = (e: YouTubeEvent<number>) => {
    playerRef.current = e.target;

    // 1: 재생 중, 2: 일시정지. 유튜브 UI로 직접 조작한 경우까지 상태에 반영한다.
    if (e.data === 1) onPlayingChange(true);
    else if (e.data === 2) onPlayingChange(false);
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
