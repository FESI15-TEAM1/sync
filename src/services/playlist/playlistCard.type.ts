export interface LikePlaylistResponse {
  items: Playlist[];
  nextCursor: string | null;
}

export interface MyplaylistResponse {
  items: MyPlaylistItem[];
  nextCursor: string | null;
}

export interface GetUserPlaylistsParams {
  cursor?: string;
  limit?: number;
}

export interface Playlist {
  id: number;
  title: string;
  image: string;
  trackCount: number;
  likeCount: number;
  owner: PlaylistOwner;
  createdAt: string;
}

export interface PlaylistOwner {
  userId: number;
  nickname: string;
  image: string;
}
export interface MyPlaylistItem {
  id: number;
  title: string;
  description: string;
  image: string;
  isPublic: boolean;
  trackCount: number;
  createdAt: string;
}
