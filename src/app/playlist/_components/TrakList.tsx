'use client';

import type { ReactNode } from 'react';

import Track from '@/components/domain/Track';
import type { CreatePlaylistTrack } from '@/types/playlist';

export default function TrackList({
  trackList,
  onTrackClick,
  Button,
}: {
  trackList: CreatePlaylistTrack[];
  onTrackClick?: (track: CreatePlaylistTrack) => void;
  Button?: ReactNode;
}) {
  return (
    <div className="p-2">
      {trackList.map((item) => {
        return (
          <Track
            videoId={item.videoId}
            key={item.videoId}
            img={item.thumbnail}
            title={item.title}
            artist={item.artist}
            onClick={() => onTrackClick?.(item)}
            Button={Button}
          />
        );
      })}
    </div>
  );
}
