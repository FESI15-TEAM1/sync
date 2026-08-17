'use client';

import { Reorder, useDragControls } from 'motion/react';
import Image from 'next/image';

import Grip from '@/assets/icons/grip.svg';
import Minus from '@/assets/icons/minus.svg';
import defaultImage from '@/assets/images/default.png';
import IconButton from '@/components/IconButton';
import type { PlaylistTrack } from '@/services/playlist/playlist';

export default function ReorderableTrackList({
  tracks,
  onReorder,
  onRemoveTrack,
}: {
  tracks: PlaylistTrack[];
  onReorder: (tracks: PlaylistTrack[]) => void;
  onRemoveTrack: (track: PlaylistTrack) => void;
}) {
  return (
    <Reorder.Group
      axis="y"
      values={tracks}
      onReorder={onReorder}
      className="flex flex-col gap-1 p-2"
    >
      {tracks.map((track) => (
        <ReorderableTrackItem
          key={track.videoId}
          track={track}
          onRemove={() => onRemoveTrack(track)}
        />
      ))}
    </Reorder.Group>
  );
}

function ReorderableTrackItem({
  track,
  onRemove,
}: {
  track: PlaylistTrack;
  onRemove: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={track}
      dragListener={false}
      dragControls={dragControls}
      className="bg-bg-card flex items-center gap-2 rounded-xl p-2"
    >
      <button
        type="button"
        className="text-text-secondary hover:text-text-primary touch-none px-1 py-2"
        style={{ cursor: 'grab' }}
        onPointerDown={(e) => dragControls.start(e)}
        aria-label="순서 변경"
      >
        <Grip width={20} height={20} />
      </button>
      <Image
        src={track.thumbnail || defaultImage}
        alt="thumbnail"
        width={40}
        height={40}
        className="flex-none rounded-lg"
      />
      <div className="grow">
        <h3 className="text-text-primary">{track.title}</h3>
        <span className="text-text-secondary text-[12px]">
          {track.artist}
        </span>
      </div>
      <IconButton
        type="button"
        className="border-border text-text-secondary hover:text-text-primary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm"
        size="sm"
        onClick={onRemove}
      >
        <Minus color="text-text-secondary" />
      </IconButton>
    </Reorder.Item>
  );
}
