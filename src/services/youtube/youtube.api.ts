import { clientFetch } from '@/lib/http/client-fetch';
import type { YoutubeSearchTracksResponse } from '@/services/youtube/youtube.types';

export const searchYoutubeTracks = (q: string, pageToken?: string) => {
  const params: Record<string, string> = { q };
  if (pageToken) params.pageToken = pageToken;

  return clientFetch<YoutubeSearchTracksResponse>('/youtube/searchTrack', {
    method: 'GET',
    params,
  });
};
