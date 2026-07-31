'use client';

import type { ReactNode } from 'react';

import Track from '@/components/domain/Track';
import type { PlaylistTrack } from '@/services/playlist/playlist';

export default function TrackList({
  trackList,
  onTrackClick,
  Button,
}: {
  trackList: PlaylistTrack[];
  onTrackClick?: (track: PlaylistTrack) => void;
  Button?: ReactNode | ((track: PlaylistTrack) => ReactNode);
}) {
  return (
    <div className="p-2">
      {trackList.map((track) => {
        return (
          <Track
            videoId={track.videoId}
            key={track.videoId}
            img={track.thumbnail}
            title={track.title}
            artist={track.artist}
            onClick={() => onTrackClick?.(track)}
            Button={typeof Button === 'function' ? Button(track) : Button} // 호출 시점에 값을 전달받아 캡쳐되어있는 값과 비교하는 클로져 형태로 받아 같은 ui를 반환하지 않도록 구현
          />
        );
      })}
    </div>
  );
}
