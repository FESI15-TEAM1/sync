interface YoutubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YoutubeThumbnails {
  default?: YoutubeThumbnail;
  medium?: YoutubeThumbnail;
  high?: YoutubeThumbnail;
}

interface YoutubeSearchSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
}

export interface YoutubeSearchItemVideo {
  kind: 'youtube#searchResult';
  etag: string;
  id: { kind: 'youtube#video'; videoId: string };
  snippet: YoutubeSearchSnippet;
}

export interface YoutubeSearchItemChannel {
  kind: 'youtube#searchResult';
  etag: string;
  id: { kind: 'youtube#channel'; channelId: string };
  snippet: YoutubeSearchSnippet;
}

export interface YoutubeSearchItemPlaylist {
  kind: 'youtube#searchResult';
  etag: string;
  id: { kind: 'youtube#playlist'; playlistId: string };
  snippet: YoutubeSearchSnippet;
}

export type YoutubeSearchItem =
  | YoutubeSearchItemVideo
  | YoutubeSearchItemChannel
  | YoutubeSearchItemPlaylist;

export interface YoutubeSearchResponse {
  kind: 'youtube#searchListResponse';
  etag: string;
  nextPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeSearchItem[];
}

export function isYoutubeVideoItem(item: YoutubeSearchItem): item is YoutubeSearchItemVideo {
  return item.id.kind === 'youtube#video';
}
