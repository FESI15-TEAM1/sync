import { cookies } from 'next/headers';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export async function POST() {
  const cookieStore = await cookies();

  try {
    await serverFetch('/auth/logout', {
      method: 'POST',
    });

    // 백엔드 로그아웃 성공 후 쿠키 제거
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return new Response(null, {
      status: 204,
    });
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
      {
        status: 500,
      },
    );
  }
}
