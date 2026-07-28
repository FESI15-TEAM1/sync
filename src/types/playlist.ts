export interface CreatePlaylistTrack {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
}

export interface CreatePlaylistRequest {
  title: string;
  description: string;
  image: string;
  isPublic: boolean;
  tracks: CreatePlaylistTrack[];
}
