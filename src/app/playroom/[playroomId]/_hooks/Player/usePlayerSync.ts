'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

import type { YoutubePlayerHandle } from '../../_components/Player/YoutubePlayer';
import type { PlaybackState } from '../useWSConnect';

// 방장과 이만큼 벌어졌을 때만 탐색한다. 매번 맞추면 재생이 계속 끊긴다.
const SYNC_TOLERANCE_SECONDS = 1.5;

// 버퍼링 등으로 조금씩 밀리는 만큼을 참가자 쪽에서 주기적으로 다시 맞춘다.
const SYNC_INTERVAL_MS = 5000;

/** 방장이 상태를 보낸 뒤 흐른 시간까지 더한, 지금 맞춰야 할 재생 위치(초). */
function getSyncTargetTime(playback: PlaybackState) {
  const elapsed = (Date.now() - new Date(playback.updatedAt).getTime()) / 1000;
  const seekTo = playback.isPlaying
    ? playback.currentTime + elapsed
    : playback.currentTime;
  return seekTo > playback.currentTime ? seekTo : playback.currentTime;
}

/** 참가자의 플레이어를 방장의 재생 상태(곡·위치·재생 여부)에 맞춘다. */
export function syncPlayerToHost(
  player: YoutubePlayerHandle,
  playback: PlaybackState,
) {
  const targetTime = getSyncTargetTime(playback);

  // iframe 에 다른 곡이 올라가 있으면 곡부터 갈아끼운다. 이때 위치는 불러오면서 함께 지정한다.
  if (player.getLoadedVideoId() !== playback.videoId) {
    if (playback.isPlaying) player.loadVideo(playback.videoId, targetTime);
    else player.cueVideo(playback.videoId, targetTime);
    return;
  }

  if (Math.abs(player.getCurrentTime() - targetTime) > SYNC_TOLERANCE_SECONDS)
    player.seekTo(targetTime);

  if (playback.isPlaying) player.play();
  else player.pause();
}

/** 참가자는 방장의 재생 상태를 계속 따라가고, 방장은 서버에 남아 있던 상태를 한 번 되살린다. */
export function usePlayerSync({
  playerRef,
  isHost,
  playback,
}: {
  playerRef: RefObject<YoutubePlayerHandle | null>;
  isHost: boolean;
  playback: PlaybackState | null;
}) {
  // 준비되기 전의 재생·탐색 명령은 조용히 무시되므로, 준비된 시점을 알아야 다시 맞출 수 있다.
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // 방장이 서버의 마지막 재생 상태를 이미 되살렸는지. 복원은 딱 한 번이어야 한다.
  const hasRestoredRef = useRef(false);

  const handlePlayerReady = () => {
    setIsPlayerReady(true);

    const player = playerRef.current;
    if (!player || !playback) return;

    // 방장에게는 이 한 번이 곧 복원이다. 아래 이펙트가 두 번 맞추지 않도록 표시해 둔다.
    hasRestoredRef.current = true;
    syncPlayerToHost(player, playback);
  };

  // 방장은 재생 상태의 주인이므로 자기가 보낸 브로드캐스트를 따라가지 않는다.
  // 따라가게 두면 로컬 조작과 되돌아온 에코가 같은 플레이어를 서로 밀어낸다.
  useEffect(() => {
    if (isHost || !playback) return;

    const sync = () => {
      if (playerRef.current) syncPlayerToHost(playerRef.current, playback);
    };

    // 새 상태가 올 때마다 한 번 맞추고, 재생 중에는 벌어지는 오차를 주기적으로 다시 맞춘다.
    sync();
    if (!playback.isPlaying) return;

    const interval = setInterval(sync, SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [playerRef, isHost, playback]);

  // 방장이 방을 나갔다 돌아오면 플레이어는 빈 상태로 다시 뜬다. 서버가 들고 있던 마지막
  // 재생 상태를 첫 스냅샷으로 한 번만 되살린다. 스냅샷이 준비보다 늦게 올 수 있어
  // handlePlayerReady 만으로는 부족하고, 이후 브로드캐스트는 방장이 주인이므로 무시한다.
  useEffect(() => {
    const player = playerRef.current;
    if (!isHost || hasRestoredRef.current || !isPlayerReady || !playback)
      return;
    if (!player) return;

    hasRestoredRef.current = true;
    syncPlayerToHost(player, playback);
  }, [playerRef, isHost, isPlayerReady, playback]);

  return { isPlayerReady, handlePlayerReady };
}
