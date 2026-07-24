'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
interface Track {
  id: number;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

import defaultImg from '@/assets/images/default.png';
import Track from '@/components/domain/Track';
export default function TrackList({ trackList }: { trackList: Track[] }) {
  const router = useParams();
  console.log(router.id);
  const img = defaultImg;
  console.log(img);

  // id값으로 데이터 가져와서 패치
  // endpoint playlists/{playlistid}

  return (
    <div className="p-2">
      {trackList.map((item) => {
        return (
          <Track
            videoId={item.videoId}
            key={item.id}
            img={item.thumbnail}
            title={item.title}
            artist={item.artist}
          />
        );
      })}
    </div>
  );
}
