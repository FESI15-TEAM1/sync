'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import mookImage from '@/assets/images/mook.jpg';
import type { Track } from '@/services/playlist/PlatylistDetail.type';

import type { PlaybackState } from '../../_hooks/useWSConnect';
import Controller from './Controller';
import PlayProgressBar from './PlayProgressBar';
import YoutubePlayer, { type YoutubePlayerHandle } from './YoutubePlayer';

// 이 시간을 넘겨 재생했다면 이전 곡으로 넘어가는 대신 현재 곡을 처음부터 다시 재생한다.
const RESTART_THRESHOLD_SECONDS = 3;

// 방장과 이만큼 벌어졌을 때만 탐색한다. 매번 맞추면 재생이 계속 끊긴다.
const SYNC_TOLERANCE_SECONDS = 1.5;

// 버퍼링 등으로 조금씩 밀리는 만큼을 참가자 쪽에서 주기적으로 다시 맞춘다.
const SYNC_INTERVAL_MS = 5000;

// 재생 명령을 보냈는데 이만큼 지나도 재생되지 않으면 브라우저가 자동재생을 막은 것으로 본다.
const AUTOPLAY_BLOCKED_TIMEOUT_MS = 1500;

/** 방장이 상태를 보낸 뒤 흐른 시간까지 더한, 지금 맞춰야 할 재생 위치(초). */
function getSyncTargetTime(playback: PlaybackState) {
  const elapsed = (Date.now() - new Date(playback.updatedAt).getTime()) / 1000;
  const seekTo = playback.isPlaying
    ? playback.currentTime + elapsed
    : playback.currentTime;
  return seekTo > playback.currentTime ? seekTo : playback.currentTime;
}

/** 참가자의 플레이어를 방장의 재생 상태(곡·위치·재생 여부)에 맞춘다. */
function syncPlayerToHost(
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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
  const thumbnail =
    currentTrack?.thumbnail ||
    (currentVideoId
      ? `https://i.ytimg.com/vi/${currentVideoId}/hqdefault.jpg`
      : mookImage.src);

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
      setCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
      setDuration(playerRef.current?.getDuration() ?? 0);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  /* ------------------------------ 방장: 보내기 ------------------------------ */

  // 방장이 재생을 시작하기 전에는 알릴 상태 자체가 없다. 한 번이라도 알린 뒤부터
  // 새 참가자에게 다시 알려 줄 수 있다.
  const hasPublishedRef = useRef(false);

  // 방장이 재생/일시정지/탐색/곡 변경을 할 때마다 참가자들이 따라올 수 있도록 알린다.
  const publishPlayback = (videoId: string, playing: boolean, time: number) => {
    hasPublishedRef.current = true;
    onPlaybackChange({ videoId, isPlaying: playing, currentTime: time });
  };

  const playTrack = (track: Track) => {
    playerRef.current?.loadVideo(track.videoId);
    setSelectedVideoId(track.videoId);
    setIsPlaying(true);
    publishPlayback(track.videoId, true, 0);
  };

  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time);
    // 일시정지 상태에서는 폴링이 돌지 않으므로 여기서 직접 반영해야 막대가 움직인다.
    setCurrentTime(time);

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
      playerRef.current?.pause();
      playerRef.current?.seekTo(0);
      setCurrentTime(0);

      if (currentVideoId) publishPlayback(currentVideoId, false, 0);
      return;
    }

    playTrack(nextTrack);
  };

  const handlePlayPreviousTrack = () => {
    const elapsed = playerRef.current?.getCurrentTime() ?? 0;
    const previousTrack = tracks[currentIndex - 1];

    if (elapsed > RESTART_THRESHOLD_SECONDS || !previousTrack) {
      playerRef.current?.seekTo(0);
      setCurrentTime(0);

      if (currentVideoId) publishPlayback(currentVideoId, isPlaying, 0);
      return;
    }

    playTrack(previousTrack);
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

  /* ----------------------------- 참가자/방장: 따라가기 ---------------------------- */

  // 준비되기 전의 재생·탐색 명령은 조용히 무시되므로, 준비된 시점을 알아야 다시 맞출 수 있다.
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const handlePlayerReady = () => {
    setIsPlayerReady(true);

    const player = playerRef.current;
    if (!player || !playback) return;

    syncPlayerToHost(player, playback);
  };

  useEffect(() => {
    if (!playback) return;

    const sync = () => {
      if (playerRef.current) syncPlayerToHost(playerRef.current, playback);
    };

    // 새 상태가 올 때마다 한 번 맞추고, 재생 중에는 벌어지는 오차를 주기적으로 다시 맞춘다.
    sync();
    if (!playback.isPlaying) return;

    const interval = setInterval(sync, SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [playback]);

  // 소리 있는 재생은 브라우저의 자동재생 정책에 막힐 수 있지만 음소거 재생은 늘 허용된다.
  // 재생해야 하는데 한동안 재생되지 않으면 막힌 것으로 보고, 음소거로라도 방장을 따라간다.
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
  }, [isPlayerReady, playback, isPlaying]);

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
  }, [isMutedForAutoplay]);

  return (
    <div className="bg-bg-card border-border box-border flex flex-col items-center gap-2 rounded-xl border px-2 py-5 text-center lg:py-8">
      {/* thumbnail image */}
      <Image
        src={thumbnail}
        alt=""
        width={250}
        height={250}
        className="aspect-square max-w-[100px] rounded-2xl lg:max-w-none"
      />

      {/* song title */}
      <h2 className="pt-2 text-base font-bold text-white">
        {currentTrack?.title ?? ''}
      </h2>

      {/* song artist */}
      <p className="text-text-secondary text-xs">
        {currentTrack?.artist ?? ''}
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
          ? '음소거로 재생 중이에요. 화면을 한 번 클릭하면 소리가 켜져요'
          : '재생 컨트롤은 방장만 가능해요'}
      </span>

      {/* 실제 재생을 담당하는 숨겨진 iframe. 재생할 곡이 정해진 뒤에만 마운트한다.
          곡 정보(제목·썸네일)를 몰라도 videoId 만 있으면 재생은 할 수 있다. */}
      {currentVideoId && (
        <YoutubePlayer
          ref={playerRef}
          videoId={currentVideoId}
          onPlayingChange={setIsPlaying}
          onReady={handlePlayerReady}
          // 참가자는 곡이 끝나도 스스로 넘기지 않는다. 다음 곡은 방장의 playback_sync 로만 바뀐다.
          onEnded={isHost ? handlePlayNextTrack : undefined}
        />
      )}
    </div>
  );
}
