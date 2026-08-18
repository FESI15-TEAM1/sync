'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import type { Track } from '@/services/playlist/PlatylistDetail.type';

import { useAutoplayFallback } from '../../_hooks/Player/useAutoplayFallback';
import { useHostPlaybackPublisher } from '../../_hooks/Player/useHostPlaybackPublisher';
import { usePlaybackProgress } from '../../_hooks/Player/usePlaybackProgress';
import { usePlayerSync } from '../../_hooks/Player/usePlayerSync';
import { useVolume } from '../../_hooks/Player/useVolume';
import type { PlaybackState } from '../../_hooks/useWSConnect';
import Controller from './Controller';
import PlayProgressBar from './PlayProgressBar';
import VolumeControl from './VolumeControl';
import WaitingDots from './WaitingDots';
import YoutubePlayer, { type YoutubePlayerHandle } from './YoutubePlayer';

// 이 시간을 넘겨 재생했다면 이전 곡으로 넘어가는 대신 현재 곡을 처음부터 다시 재생한다.
const RESTART_THRESHOLD_SECONDS = 3;

/** 곡 정보를 화면에 띄우는 데 필요한 최소 필드. 플레이리스트 트랙과 방 상세의 현재 곡이 모두 만족한다. */
type PlayerTrack = Pick<Track, 'videoId' | 'title' | 'artist' | 'thumbnail'>;

export default function Player({
  tracks,
  currentTrack: roomTrack,
  isHost,
  playback,
  onPlaybackChange,
  memberJoinedCount,
}: {
  // 방이 튼 플레이리스트. 참가자는 접근 권한이 없을 수 있어 방장에게만 채워진다.
  tracks: Track[];
  // 방이 재생 중이던 곡. 재생 전이면 null 이다.
  currentTrack: PlayerTrack | null;
  isHost: boolean;
  // 방장이 브로드캐스트한 최신 재생 상태. 아직 아무도 재생하지 않았으면 null 이다.
  playback: PlaybackState | null;
  // 방장이 재생을 조작할 때마다 참가자들에게 알린다.
  onPlaybackChange: (playback: {
    videoId: string;
    isPlaying: boolean;
    currentTime: number;
  }) => void;
  // 참가자가 들어올 때마다 늘어난다. 방장이 현재 재생 상태를 다시 알리는 신호로 쓴다.
  memberJoinedCount: number;
}) {
  const playerRef = useRef<YoutubePlayerHandle | null>(null);

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 트랙 목록은 비동기로 도착하므로 인덱스를 state 로 들고 있지 않고 매 렌더에서 찾는다.
  // 방장은 자기가 고른 곡을, 참가자는 방장이 알려준 곡만 재생한다.
  // 아직 아무것도 고르지 않았으면 방이 틀고 있던 곡 → (방장 한정) 첫 트랙 순으로 떨어진다.
  const currentVideoId = isHost
    ? (selectedVideoId ?? roomTrack?.videoId ?? tracks[0]?.videoId)
    : (playback?.videoId ?? roomTrack?.videoId);
  const currentIndex = tracks.findIndex(
    (track) => track.videoId === currentVideoId,
  );

  // 참가자는 트랙 목록이 없으므로 방 상세가 알려준 곡 정보로 표시한다.
  // 방장이 곡을 넘긴 직후처럼 둘 다 모르는 곡이면 정보 없이 재생만 한다.
  const currentTrack: PlayerTrack | null =
    tracks[currentIndex] ??
    (roomTrack?.videoId === currentVideoId ? roomTrack : null);

  // 방 상세를 다시 받아오는 동안에도 썸네일은 videoId 로 바로 만들 수 있다.
  const thumbnail = currentVideoId
    ? `https://i.ytimg.com/vi/${currentVideoId}/hqdefault.jpg`
    : null;

  const { currentTime, duration, seekPlayerTo, clearPendingSeek } =
    usePlaybackProgress({ playerRef, currentVideoId });

  const { isPlayerReady, handlePlayerReady } = usePlayerSync({
    playerRef,
    isHost,
    playback,
  });

  const isMutedForAutoplay = useAutoplayFallback({
    playerRef,
    isPlayerReady,
    playback,
    isPlaying,
  });

  const { volume, isMuted, changeVolume, toggleMute, applyVolume } = useVolume({
    playerRef,
    isPlayerReady,
    isMutedForAutoplay,
  });

  const publishPlayback = useHostPlaybackPublisher({
    playerRef,
    isHost,
    currentVideoId,
    isPlaying,
    memberJoinedCount,
    onPlaybackChange,
  });

  // 플레이어가 새로 준비될 때마다 재생 상태를 맞추고, 이 브라우저의 볼륨 설정도 다시 얹는다.
  const handleReady = () => {
    handlePlayerReady();
    applyVolume();
  };

  /* ------------------------------ 방장: 조작하기 ------------------------------ */

  const playTrack = (track: Track) => {
    clearPendingSeek();
    playerRef.current?.loadVideo(track.videoId);
    setSelectedVideoId(track.videoId);
    setIsPlaying(true);
    publishPlayback(track.videoId, true, 0);
  };

  const handleSeek = (time: number) => {
    seekPlayerTo(time);

    if (currentVideoId) publishPlayback(currentVideoId, isPlaying, time);
  };

  const handlePlayPause = () => {
    const player = playerRef.current;
    // 플레이어가 없으면 실제로는 아무 일도 안 일어나므로, 참가자들에게도 알리지 않는다.
    if (!player || !currentVideoId) return;

    if (isPlaying) player.pause();
    else player.play();

    publishPlayback(currentVideoId, !isPlaying, player.getCurrentTime());
  };

  const handlePlayNextTrack = () => {
    const nextTrack = tracks[currentIndex + 1];

    // 마지막 곡이면 멈추고 처음으로 되감는다.
    if (!nextTrack) {
      seekPlayerTo(0);
      playerRef.current?.pause();

      if (currentVideoId) publishPlayback(currentVideoId, false, 0);
      return;
    }

    playTrack(nextTrack);
  };

  const handlePlayPreviousTrack = () => {
    const elapsed = playerRef.current?.getCurrentTime() ?? 0;
    const previousTrack = tracks[currentIndex - 1];

    if (elapsed > RESTART_THRESHOLD_SECONDS || !previousTrack) {
      seekPlayerTo(0);
      if (!isPlaying) playerRef.current?.pause();

      if (currentVideoId) publishPlayback(currentVideoId, isPlaying, 0);
      return;
    }

    playTrack(previousTrack);
  };

  const thumbnailStyle =
    'bg-disabled aspect-square max-w-25 object-cover lg:max-w-none';

  return (
    <div className="bg-bg-card border-border box-border flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center lg:gap-2 lg:py-5 lg:py-8">
      {/* thumbnail image */}
      <div className="relative h-25 w-25 overflow-hidden rounded-2xl lg:h-60 lg:w-60">
        {thumbnail ? (
          <Image src={thumbnail} alt="" fill className={thumbnailStyle} />
        ) : (
          <div className={thumbnailStyle}></div>
        )}
      </div>

      {/* song title */}
      <h2 className="text-base font-bold text-white lg:pt-2">
        {currentTrack?.title ?? '방장의 재생을 기다리는 중이에요⏱️'}
      </h2>

      {/* song artist */}
      <p className="text-text-secondary text-xs">
        {currentTrack?.artist ?? <WaitingDots />}
      </p>

      {/* play progress bar */}
      <PlayProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={isHost ? handleSeek : undefined}
      />

      {/* controller panel */}
      <Controller
        playNextTrack={handlePlayNextTrack}
        playPreviousTrack={handlePlayPreviousTrack}
        playPause={handlePlayPause}
        isPlaying={isPlaying}
        isHost={isHost}
      />

      {/* control access notice */}
      <span className="text-text-secondary text-center text-xs">
        {isMutedForAutoplay
          ? '음소거로 재생 중이에요. 화면을 한 번 클릭하면 소리가 켜져요'
          : '재생 컨트롤은 방장만 가능해요'}
      </span>

      {/* volume control */}
      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={changeVolume}
        onToggleMute={toggleMute}
      />

      {/* 실제 재생을 담당하는 숨겨진 iframe. 재생할 곡이 정해진 뒤에만 마운트한다.
          곡 정보(제목·썸네일)를 몰라도 videoId 만 있으면 재생은 할 수 있다. */}
      {currentVideoId && (
        <YoutubePlayer
          ref={playerRef}
          videoId={currentVideoId}
          onPlayingChange={setIsPlaying}
          onReady={handleReady}
          // 참가자는 곡이 끝나도 스스로 넘기지 않는다. 다음 곡은 방장의 playback_sync 로만 바뀐다.
          onEnded={isHost ? handlePlayNextTrack : undefined}
        />
      )}
    </div>
  );
}
