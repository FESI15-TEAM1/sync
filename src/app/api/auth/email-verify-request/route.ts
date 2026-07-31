import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { request } from '@/lib/http/server-fetch';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const data = await request('/auth/email-verify-request', {
      method: 'POST',
      body,
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
