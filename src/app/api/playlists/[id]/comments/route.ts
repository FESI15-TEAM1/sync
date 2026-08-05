import { NextResponse } from 'next/server';

import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const data = await serverFetch<CommentItemsType>(
      `/playlists/${(await params).id}/comments`,
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
      { error: '유효하지 않은 json body 입니다' },
      { status: 400 },
    );
  }
}
