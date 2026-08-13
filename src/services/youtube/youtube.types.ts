import type { PlaylistTrack } from '@/services/playlist/playlist';

export interface YoutubeSearchTracksResponse {
  items: PlaylistTrack[];
  nextPageToken: string | null;
}
