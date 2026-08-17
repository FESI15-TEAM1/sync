import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = req.nextUrl;
    const cursor = searchParams.get('cursor');
    const limit = searchParams.get('limit');

    const queryParams: Record<string, string> = {};
    if (cursor) queryParams.cursor = cursor;
    if (limit) queryParams.limit = limit;

    const data = await serverFetch<CommentItemsType>(
      `/playlists/${(await params).id}/comments`,
      {
        method: 'GET',
        params: queryParams,
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
      { error: '유효하지 않은 json body 입니다' },
      { status: 400 },
    );
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const data = await serverFetch(`/playlists/${(await params).id}/comments`, {
      method: 'POST',
      body,
    });

    return NextResponse.json(data, { status: 201 });
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
      { error: '유효하지 않은 json body 입니다' },
      { status: 400 },
    );
  }
}
