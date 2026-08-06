export interface CreatePlayroomRequest {
  title: string;
  description: string;
  playlistId: number;
  hashtags: string[];
}

export interface CreatePlayroomResponse {
  id: number;
}
