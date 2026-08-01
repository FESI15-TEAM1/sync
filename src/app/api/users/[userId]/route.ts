import { APIError } from '@/lib/http/error';
import { request } from '@/lib/http/server-fetch';
import type { UserProfile } from '@/services/user/user.types';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  try {
    const data = await request<UserProfile>(`/users/${userId}`, {
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
