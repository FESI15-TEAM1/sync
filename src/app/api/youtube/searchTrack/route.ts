import type { NextRequest } from 'next/server';

import { request, YoutubeApiError } from '../client';
import {
  isYoutubeVideoItem,
  type YoutubeSearchResponse,
} from '../youtube.types';

export const GET = async (req: NextRequest) => {
  const q = req.nextUrl.searchParams.get('q');
  const pageToken = req.nextUrl.searchParams.get('pageToken');

  if (!q) return Response.json({ items: [], nextPageToken: null });

  try {
    const data = await request<YoutubeSearchResponse>('search', {
      method: 'GET',
      params: {
        part: 'snippet',
        type: 'video',
        maxResults: '10',
        q,
        ...(pageToken ? { pageToken } : {}),
      },
    });

    const items = data.items.filter(isYoutubeVideoItem).map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    return Response.json({
      items,
      nextPageToken: data.nextPageToken ?? null,
    });
  } catch (err) {
    if (err instanceof YoutubeApiError) {
      return Response.json(
        { error: { code: 'YOUTUBE_API_ERROR', message: err.message } },
        { status: err.status },
      );
    }
    return Response.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '알 수 없는 오류가 발생했습니다.',
        },
      },
      { status: 500 },
    );
  }
};
