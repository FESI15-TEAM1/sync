import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { request } from '@/lib/http/server-fetch';

export async function GET(req: NextRequest) {
  const nickname = req.nextUrl.searchParams.get('nickname');

  if (!nickname) {
    return Response.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: '닉네임을 입력해주세요.',
        },
      },
      { status: 400 },
    );
  }

  try {
    const data = await request<{ available: boolean }>('/auth/nickname-check', {
      method: 'GET',
      params: { nickname },
    });

    return Response.json(data);
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
