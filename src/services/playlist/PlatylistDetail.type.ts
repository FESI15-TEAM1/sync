import type { PlaylistOwner } from './playlistCard.type';

export interface Track {
  id: number;
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export interface PlaylistDetail {
  id: number;
  title: string;
  description: string;
  image: string;
  isPublic: boolean;
  owner: PlaylistOwner;
  tracks: Track[];
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
