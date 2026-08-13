'use client';

import Minus from '@/assets/icons/minus.svg';
import TrackList from '@/components/domain/playlists/TrackList';
import IconButton from '@/components/IconButton';
import type { PlaylistTrack } from '@/services/playlist/playlist';

export default function AddedTracksSection({
  tracks,
  onRemoveTrack,
}: {
  tracks: PlaylistTrack[];
  onRemoveTrack: (track: PlaylistTrack) => void;
}) {
  return (
    <>
      <span className="text-text-secondary">추가된곡</span>
      <div className="w-full">
        <TrackList
          trackList={tracks}
          onTrackClick={onRemoveTrack}
          Button={
            <IconButton
              className="border-border text-text-secondary hover:text-text-primary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm"
              size="sm"
            >
              <Minus color="text-text-secondary" />
            </IconButton>
          }
        />
      </div>
    </>
  );
}
