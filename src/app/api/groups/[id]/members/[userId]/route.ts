import { NextResponse } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  try {
    const { id, userId } = await params;

    await serverFetch(`/groups/${id}/members/${userId}`, {
      method: 'DELETE',
    });

    return new NextResponse(null, { status: 204 });
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
