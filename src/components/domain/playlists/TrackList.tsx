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
  if (trackList.length === 0) {
    return (
      <p className="text-text-secondary p-2 text-sm">추가된 곡이 없습니다.</p>
    );
  }

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

export function TrackListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="p-2" role="status" aria-busy="true">
      <span className="sr-only">트랙 목록을 불러오는 중입니다.</span>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 100}ms` }}
          className="flex animate-pulse items-center justify-between gap-4 p-2"
        >
          <div className="bg-border size-10 shrink-0 rounded-lg" />
          <div className="flex min-w-0 grow flex-col gap-1.5">
            <div className="bg-border h-4 w-1/3 rounded" />
            <div className="bg-border h-3 w-1/2 rounded" />
          </div>
          <div className="bg-border size-6 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}
