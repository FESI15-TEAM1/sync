'use client';

import { useRef } from 'react';

import TrackList from '@/app/playlist/_components/TrackList';
import PlaylistPlayer from '@/app/playlist/[id]/_components/PlaylistPlayer';
import { type PlaylistPlayerHandle } from '@/app/playlist/[id]/_components/PlaylistPlayer';
import TrackHoverController from '@/app/playlist/[id]/_components/TrackHoverController';
import { usePlayerStore } from '@/providers/player-store-provider';
import { type PlaylistTrack } from '@/types/playlist';

export default function PlaylistDetailView({
  tracks,
}: {
  tracks: PlaylistTrack[];
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const stop = usePlayerStore((state) => state.stop);
  const playerRef = useRef<PlaylistPlayerHandle | null>(null);

  const handleTrackClick = (track: PlaylistTrack) => {
    if (currentTrack?.videoId === track.videoId) {
      if (isPlaying) playerRef.current?.pause();
      else playerRef.current?.play();
      return;
    }
    playTrack(track);
  };

  const handleEnd = () => {
    const currentIndex = tracks.findIndex(
      (track) => track.videoId === currentTrack?.videoId,
    );
    const nextTrack = tracks[currentIndex + 1];
    if (nextTrack) playTrack(nextTrack);
    else stop();
  };

  return (
    <div className="p-2">
      <TrackList
        trackList={tracks}
        onTrackClick={handleTrackClick}
        Button={(track) => (
          <TrackHoverController
            isPlaying={track.videoId === currentTrack?.videoId && isPlaying}
            onToggle={() => handleTrackClick(track)}
          />
        )}
      />
      {currentTrack && (
        <PlaylistPlayer
          ref={playerRef}
          videoId={currentTrack.videoId}
          onEnded={handleEnd}
        />
      )}
    </div>
  );
}
