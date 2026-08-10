import { NextResponse } from 'next/server';

import type { CommentItemType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  try {
    const body = await req.json();
    const { id, commentId } = await params;
    const data = await serverFetch<CommentItemType>(
      `/playlists/${id}/comments/${commentId}`,
      {
        method: 'PATCH',
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
      { error: '유효하지 않은 json body 입니다' },
      { status: 400 },
    );
  }
}
