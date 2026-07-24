import type { NextRequest } from 'next/server';

import { request, YoutubeApiError } from '../client';

export const GET = async (req: NextRequest) => {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) return Response.json({ items: [] });

  try {
    const data = await request('search', {
      method: 'GET',
      params: { part: 'snippet', type: 'video', maxResults: '10', q },
    });
    return Response.json(data);
  } catch (err) {
    if (err instanceof YoutubeApiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: '알 수 없는 오류' }, { status: 500 });
  }
};
