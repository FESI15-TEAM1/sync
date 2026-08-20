'use client';

import { useQuery } from '@tanstack/react-query';

import { getPlaylistDetail } from '@/services/playlist/playlist.api';

export default function PlaylistRequestName({
  playlistId,
}: {
  playlistId: number;
}) {
  const { data } = useQuery({
    queryKey: ['playlists', playlistId],
    queryFn: () => getPlaylistDetail(playlistId),
  });

  return (
    <span className="font-semibold">{data?.title ?? '플레이리스트'}</span>
  );
}
