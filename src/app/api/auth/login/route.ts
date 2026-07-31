import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/api/http/error';
import { request } from '@/lib/api/http/server-fetch';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const data = await request<{ accessToken: string; refreshToken: string }>(
      '/auth/login',
      {
        method: 'POST',
        body,
      },
    );

    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken);
    cookieStore.set('refreshToken', data.refreshToken);

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof APIError) {
      return Response.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
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
