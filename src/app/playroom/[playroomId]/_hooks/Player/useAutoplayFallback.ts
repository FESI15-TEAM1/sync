'use client';

import { type RefObject, useEffect, useState } from 'react';

import type { YoutubePlayerHandle } from '../../_components/Player/YoutubePlayer';
import type { PlaybackState } from '../useWSConnect';
import { syncPlayerToHost } from './usePlayerSync';

// 재생 명령을 보냈는데 이만큼 지나도 재생되지 않으면 브라우저가 자동재생을 막은 것으로 본다.
const AUTOPLAY_BLOCKED_TIMEOUT_MS = 1500;

/**
 * 소리 있는 재생은 브라우저의 자동재생 정책에 막힐 수 있지만 음소거 재생은 늘 허용된다.
 * 재생해야 하는데 한동안 재생되지 않으면 막힌 것으로 보고, 음소거로라도 방장을 따라간다.
 */
export function useAutoplayFallback({
  playerRef,
  isPlayerReady,
  playback,
  isPlaying,
}: {
  playerRef: RefObject<YoutubePlayerHandle | null>;
  isPlayerReady: boolean;
  playback: PlaybackState | null;
  isPlaying: boolean;
}) {
  const [isMutedForAutoplay, setIsMutedForAutoplay] = useState(false);

  // isPlayerReady 를 함께 보는 이유: 플레이어가 준비되기 전에 타이머가 끝나면 음소거로 되돌릴
  // 대상이 없어 그냥 지나가는데, 준비된 뒤 이펙트가 다시 돌아야 그때 판정을 다시 한다.
  useEffect(() => {
    if (!isPlayerReady || !playback?.isPlaying || isPlaying) return;

    const timeout = setTimeout(() => {
      const player = playerRef.current;
      if (!player) return;

      player.mute();
      // 막혀 있는 동안 재생 위치가 밀렸으므로 다시 맞추면서 재생한다.
      syncPlayerToHost(player, playback);
      setIsMutedForAutoplay(true);
    }, AUTOPLAY_BLOCKED_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [playerRef, isPlayerReady, playback, isPlaying]);

  useEffect(() => {
    if (!isMutedForAutoplay) return;

    // 페이지를 한 번이라도 조작하면 그때부터는 소리를 켤 수 있다. 채팅 입력이든 클릭이든 상관없다.
    const handleUserGesture = () => {
      playerRef.current?.unMute();
      setIsMutedForAutoplay(false);
    };

    document.addEventListener('pointerdown', handleUserGesture, { once: true });
    document.addEventListener('keydown', handleUserGesture, { once: true });

    return () => {
      document.removeEventListener('pointerdown', handleUserGesture);
      document.removeEventListener('keydown', handleUserGesture);
    };
  }, [playerRef, isMutedForAutoplay]);

  return isMutedForAutoplay;
}
