'use client';

import { type RefObject, useEffect, useRef } from 'react';

import type { YoutubePlayerHandle } from '../../_components/Player/YoutubePlayer';

/** 방장이 재생/일시정지/탐색/곡 변경을 할 때마다 참가자들이 따라올 수 있도록 알린다. */
export function useHostPlaybackPublisher({
  playerRef,
  isHost,
  currentVideoId,
  isPlaying,
  memberJoinedCount,
  onPlaybackChange,
}: {
  playerRef: RefObject<YoutubePlayerHandle | null>;
  isHost: boolean;
  currentVideoId: string | undefined;
  isPlaying: boolean;
  // 참가자가 들어올 때마다 늘어난다. 방장이 현재 재생 상태를 다시 알리는 신호로 쓴다.
  memberJoinedCount: number;
  onPlaybackChange: (playback: {
    videoId: string;
    isPlaying: boolean;
    currentTime: number;
  }) => void;
}) {
  // 방장이 재생을 시작하기 전에는 알릴 상태 자체가 없다. 한 번이라도 알린 뒤부터
  // 새 참가자에게 다시 알려 줄 수 있다.
  const hasPublishedRef = useRef(false);

  const publishPlayback = (videoId: string, playing: boolean, time: number) => {
    hasPublishedRef.current = true;
    onPlaybackChange({ videoId, isPlaying: playing, currentTime: time });
  };

  // 참가자가 접속 직후 받는 스냅샷은 방장이 마지막으로 알린 시점의 것이라, 방장이 그 뒤로
  // 아무 조작도 하지 않았다면 재생 중인데도 비어 있거나 한참 낡은 상태로 온다.
  // 그래서 누가 들어오면 방장이 지금 재생 위치를 다시 알려 바로 따라올 수 있게 한다.
  useEffect(() => {
    const player = playerRef.current;
    if (!isHost || !hasPublishedRef.current || !player || !currentVideoId)
      return;

    publishPlayback(currentVideoId, isPlaying, player.getCurrentTime());
    // 참가자가 들어온 그 순간의 상태만 다시 알린다. 방장의 조작으로 값이 바뀌는 경우는
    // 각 핸들러가 이미 알리고 있으므로, 여기서 같이 보면 같은 상태를 두 번 보내게 된다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberJoinedCount]);

  return publishPlayback;
}
