'use client';

import { type RefObject, useEffect, useState } from 'react';

import type { YoutubePlayerHandle } from '../../_components/Player/YoutubePlayer';

/** 유튜브 플레이어의 기본 볼륨과 같은 값. 처음 표시되는 슬라이더 위치이기도 하다. */
const DEFAULT_VOLUME = 100;

/** 지금의 볼륨·음소거 설정을 플레이어에 적용한다. */
function applyToPlayer(
  player: YoutubePlayerHandle,
  {
    volume,
    isMuted,
    isMutedForAutoplay,
  }: { volume: number; isMuted: boolean; isMutedForAutoplay: boolean },
) {
  player.setVolume(volume);

  // 자동재생 폴백이 음소거를 잡고 있는 동안에는 건드리지 않는다.
  if (isMutedForAutoplay) return;

  if (isMuted) player.mute();
  else player.unMute();
}

/**
 * 이 브라우저에서만 쓰는 볼륨 상태. 방 전체에 동기화되는 값이 아니라 각자 조절한다.
 * 플레이어가 준비되기 전의 명령은 조용히 무시되므로, 준비된 뒤 현재 설정을 다시 적용한다.
 */
export function useVolume({
  playerRef,
  isPlayerReady,
  isMutedForAutoplay,
}: {
  playerRef: RefObject<YoutubePlayerHandle | null>;
  isPlayerReady: boolean;
  /** 자동재생 폴백이 음소거를 잡고 있는 동안에는 음소거를 건드리지 않는다. */
  isMutedForAutoplay: boolean;
}) {
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isMuted, setIsMuted] = useState(false);

  // 폴백이 풀리면 이 이펙트가 다시 돌면서 사용자의 설정을 되돌려 놓는다.
  useEffect(() => {
    const player = playerRef.current;
    if (!isPlayerReady || !player) return;

    applyToPlayer(player, { volume, isMuted, isMutedForAutoplay });
  }, [playerRef, isPlayerReady, volume, isMuted, isMutedForAutoplay]);

  /**
   * 플레이어가 준비된 시점에 호출한다. 위 이펙트는 설정이 바뀔 때만 도는데,
   * 플레이어 인스턴스가 새로 만들어지면 설정은 그대로여도 다시 적용해야 한다.
   */
  const applyVolume = () => {
    const player = playerRef.current;
    if (!player) return;

    applyToPlayer(player, { volume, isMuted, isMutedForAutoplay });
  };

  const changeVolume = (next: number) => {
    setVolume(next);
    // 슬라이더를 올리는 건 소리를 듣겠다는 뜻이므로 음소거를 함께 푼다.
    if (next > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    // 볼륨을 0까지 내려둔 채 음소거를 풀면 여전히 소리가 나지 않으므로 기본값으로 되돌린다.
    if (isMuted && volume === 0) setVolume(DEFAULT_VOLUME);
    setIsMuted(!isMuted);
  };

  return { volume, isMuted, changeVolume, toggleMute, applyVolume };
}
