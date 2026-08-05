import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { MyProfile } from '@/services/user/user.types';

export async function GET() {
  try {
    const data = await serverFetch<MyProfile>('/users/me', {
      method: 'GET',
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
