import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { request } from '@/lib/http/server-fetch';
import type { CreatePlaylistRequest } from '@/services/playlist/playlist';

export async function POST(req: NextRequest) {
  const body: CreatePlaylistRequest = await req.json();

  if (!body.title) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: '제목은 필수입니다.',
        },
      },
      { status: 400 },
    );
  }

  try {
    const data = await request<{ id: number }>('/playlists', {
      method: 'POST',
      body,
    });

    return Response.json({ id: data.id }, { status: 201 });
  } catch (error) {
    if (error instanceof APIError) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        {
          status: error.status,
        },
      );
    }

    return Response.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생했습니다.',
        },
      },
      { status: 500 },
    );
  }
}
