import { NextResponse } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const data = await serverFetch<PlaylistDetail>(
      `/playlists/${(await params).id}`,
      {
        method: 'GET',
      },
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생하였습니다.',
        },
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const data = await serverFetch<PlaylistDetail>(
      `/playlists/${(await params).id}`,
      {
        method: 'PUT',
        body,
      },
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
      );
    }
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생하였습니다.',
        },
      },
      { status: 500 },
    );
  }
}
