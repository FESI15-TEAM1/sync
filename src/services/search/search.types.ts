// GET /search/{q} 응답 항목

export interface SearchPlaylistItem {
  id: number;
  title: string;
  image: string;
}

export interface SearchGroupItem {
  id: number;
  title: string;
  memberCount: number;
}

export interface SearchPlayroomItem {
  id: number;
  title: string;
  isLive: boolean;
  listenerCount: number;
}

export interface SearchSection<T> {
  items: T[];
  // null 이면 마지막 페이지입니다.
  nextCursor: string | null;
}

// GET /search/{q}
export interface SearchResponse {
  playlists: SearchSection<SearchPlaylistItem>;
  groups: SearchSection<SearchGroupItem>;
  playrooms: SearchSection<SearchPlayroomItem>;
}
