'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import CommentsSection from '@/app/playlist/detail/[id]/_components/CommentsSection';
import LikedButton from '@/app/playlist/detail/[id]/_components/LikedButton';
import PlaylistHeaderActions from '@/app/playlist/detail/[id]/_components/PlaylistHeaderActions';
import PlaylistPlayer from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import { type PlaylistPlayerHandle } from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import PlaylistPlayerBar from '@/app/playlist/detail/[id]/_components/PlaylistPlayerBar';
import TrackHoverController from '@/app/playlist/detail/[id]/_components/TrackHoverController';
import defaultImg from '@/assets/images/default.png';
import Button from '@/components/Button';
import TrackList from '@/components/domain/playlists/TrackList';
import { clientFetch } from '@/lib/http/client-fetch';
import { usePlayerStore } from '@/providers/player-store-provider';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';
import { type PlaylistTrack } from '@/services/playlist/playlist';

import { useLikedMutation } from '../hooks/useLikedQuery';

const RESTART_THRESHOLD_SECONDS = 3;

export default function PlaylistDetailView({
  userid,
}: {
  userid: string | null;
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const stop = usePlayerStore((state) => state.stop);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const playerRef = useRef<PlaylistPlayerHandle | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { id } = useParams<{ id: string }>();

  const {
    data: playlist,
    isPending: isPlaylistPending,
    error: playlistError,
  } = useQuery({
    queryKey: ['playlists', id],
    queryFn: () => clientFetch<PlaylistDetail>(`/playlists/${id}`),
  });

  const [trackIdForTime, setTrackIdForTime] = useState(currentTrack?.videoId);
  if (currentTrack?.videoId !== trackIdForTime) {
    setTrackIdForTime(currentTrack?.videoId);
    setCurrentTime(0);
    setDuration(0);
  }

  const [lastTrack, setLastTrack] = useState(currentTrack);
  if (currentTrack && currentTrack !== lastTrack) {
    setLastTrack(currentTrack);
  }
  const { mutate: toggleLiked, isPending } = useLikedMutation(
    String(playlist?.id),
  );

  const handleLikedClick = () => {
    toggleLiked(!playlist?.isLiked);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
      setDuration(playerRef.current?.getDuration() ?? 0);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    return () => setIsPlaying(false);
  }, [setIsPlaying]);

  if (isPlaylistPending)
    return <div className="text-text-primary font-bold">로딩중...</div>;
  if (playlistError) return <div>에러남</div>;

  const handleTogglePlay = () => {
    if (isPlaying) playerRef.current?.pause();
    else playerRef.current?.play();
  };

  const handleTrackClick = (track: PlaylistTrack) => {
    if (currentTrack?.videoId === track.videoId) {
      handleTogglePlay();
      return;
    }
    playerRef.current?.loadVideo(track.videoId);
    playTrack(track);
  };

  const handleEnd = () => {
    const currentIndex = playlist.tracks.findIndex(
      (track) => track.videoId === currentTrack?.videoId,
    );
    const nextTrack = playlist.tracks[currentIndex + 1];
    if (nextTrack) {
      playerRef.current?.loadVideo(nextTrack.videoId);
      playTrack(nextTrack);
    } else {
      stop();
    }
  };

  const handlePrevious = () => {
    const elapsed = playerRef.current?.getCurrentTime() ?? 0;
    if (elapsed > RESTART_THRESHOLD_SECONDS) {
      playerRef.current?.seekTo(0);
      setCurrentTime(0);
      return;
    }
    const currentIndex = playlist.tracks.findIndex(
      (track) => track.videoId === currentTrack?.videoId,
    );
    const prevTrack = playlist.tracks[currentIndex - 1];
    if (prevTrack) {
      playerRef.current?.loadVideo(prevTrack.videoId);
      playTrack(prevTrack);
    } else {
      playerRef.current?.seekTo(0);
      setCurrentTime(0);
    }
  };

  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time);
    setCurrentTime(time);
  };

  return (
    <div
      className={`flex max-w-7xl flex-col gap-10 p-2 ${currentTrack ? 'pb-24' : ''}`}
    >
      <PlaylistHeaderActions
        playlistId={id}
        isOwner={userid == String(playlist.owner.userId)}
      />
      <div className="ju flex items-center gap-4">
        <Image
          src={playlist.image || defaultImg}
          width={145}
          height={145}
          alt="플레이리스트 이미지"
          className="rounded-xl"
        />
        <div className="mb-4 flex flex-col gap-3">
          <h3 className="text-text-primary text-xl font-bold">
            {playlist.title}
          </h3>
          <span className="text-text-secondary text-sm">{`작성자: ${playlist.owner.nickname}`}</span>
          <LikedButton
            isLiked={!!playlist.isLiked}
            onClick={handleLikedClick}
          />
        </div>
      </div>
      <p className="bg-bg-card text-text-primary rounded-xl p-4">
        {playlist.description}
      </p>
      <Button className="w-full"> 그룹생성 요청</Button>
      <div className="bg-bg-card rounded-xl p-4">
        <TrackList
          trackList={playlist?.tracks}
          onTrackClick={handleTrackClick}
          Button={(track) => (
            <TrackHoverController
              isPlaying={track.videoId === currentTrack?.videoId && isPlaying}
              onToggle={() => handleTrackClick(track)}
            />
          )}
        />
      </div>
      {currentTrack && (
        <PlaylistPlayer
          ref={playerRef}
          videoId={currentTrack.videoId}
          autoPlay={isPlaying}
          onEnded={handleEnd}
        />
      )}
      {lastTrack && (
        <PlaylistPlayerBar
          track={lastTrack}
          isVisible={!!currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={handleTogglePlay}
          onPrevious={handlePrevious}
          onNext={handleEnd}
          onStop={stop}
          onSeek={handleSeek}
        />
      )}
      <CommentsSection playlistId={id} userid={userid} />
    </div>
  );
}
