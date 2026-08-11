'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

import type { YoutubePlayerHandle } from '../../_components/Player/YoutubePlayer';

// 탐색을 요청한 위치에 플레이어가 이만큼 가까워지면 실제로 옮겨간 것으로 본다.
const SEEK_SETTLE_TOLERANCE_SECONDS = 1;

// 시작 전(-1)과 큐만 올린 상태(5)의 유튜브 플레이어는 seekTo 를 무시한다.
const UNSTARTED_PLAYER_STATES = [-1, 5];

const POLL_INTERVAL_MS = 500;

/** 플레이어에서 재생 위치·길이를 읽어 막대에 반영하고, 방장의 탐색을 처리한다. */
export function usePlaybackProgress({
  playerRef,
  currentVideoId,
}: {
  playerRef: RefObject<YoutubePlayerHandle | null>;
  currentVideoId: string | undefined;
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 방금 요청한 탐색 위치. 플레이어가 실제로 그 위치로 옮겨갈 때까지 아래 폴링이
  // 낡은 값으로 막대를 되돌리지 않도록 붙잡아 둔다.
  const pendingSeekRef = useRef<number | null>(null);

  // 곡이 바뀌면 이전 곡의 재생 시간이 잠시 남아 보이지 않도록 즉시 초기화한다.
  const [trackIdForTime, setTrackIdForTime] = useState(currentVideoId);
  if (currentVideoId !== trackIdForTime) {
    setTrackIdForTime(currentVideoId);
    setCurrentTime(0);
    setDuration(0);
  }

  // 재생 중이 아닐 때도 읽는다. 방장은 재생 전에도 길이를 알아야 막대를 잡아 탐색할 수 있고,
  // 참가자는 방장이 멈춘 채로 탐색한 위치를 따라가야 하기 때문이다.
  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      setDuration(player?.getDuration() ?? 0);

      const time = player?.getCurrentTime() ?? 0;
      const pendingSeek = pendingSeekRef.current;

      // 탐색이 아직 반영되지 않았으면 방금 요청한 위치를 그대로 둔다.
      if (
        pendingSeek !== null &&
        Math.abs(time - pendingSeek) > SEEK_SETTLE_TOLERANCE_SECONDS
      )
        return;

      pendingSeekRef.current = null;
      setCurrentTime(time);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [playerRef]);

  // 아직 한 번도 재생하지 않은(시작 전·큐만 올린) 플레이어는 seekTo 를 무시하고 원래 위치를
  // 계속 보고한다. 이때는 같은 곡을 새 시작 위치로 다시 큐에 올려야 실제로 위치가 옮겨간다.
  const seekPlayerTo = (time: number) => {
    const player = playerRef.current;
    if (!player) return;

    if (
      currentVideoId &&
      UNSTARTED_PLAYER_STATES.includes(player.getPlayerState())
    )
      player.cueVideo(currentVideoId, time);
    else player.seekTo(time);

    // 일시정지 중에는 폴링이 새 값을 읽어오기까지 막대가 멈춰 보이므로 여기서 먼저 반영한다.
    pendingSeekRef.current = time;
    setCurrentTime(time);
  };

  /** 곡이 바뀌면 이전 곡에 걸어 둔 탐색 위치는 더 이상 기다릴 대상이 아니다. */
  const clearPendingSeek = () => {
    pendingSeekRef.current = null;
  };

  return { currentTime, duration, seekPlayerTo, clearPendingSeek };
}
