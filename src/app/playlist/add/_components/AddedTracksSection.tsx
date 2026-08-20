'use client';

import ReorderableTrackList from '@/components/domain/playlists/ReorderableTrackList';
import type { PlaylistTrack } from '@/services/playlist/playlist';

export default function AddedTracksSection({
  tracks,
  onReorder,
  onRemoveTrack,
}: {
  tracks: PlaylistTrack[];
  onReorder: (tracks: PlaylistTrack[]) => void;
  onRemoveTrack: (track: PlaylistTrack) => void;
}) {
  return (
    <>
      <span className="text-text-secondary">추가된곡</span>
      <div className="w-full">
        <ReorderableTrackList
          tracks={tracks}
          onReorder={onReorder}
          onRemoveTrack={onRemoveTrack}
        />
      </div>
    </>
  );
}
