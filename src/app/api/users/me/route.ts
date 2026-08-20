import { cookies } from 'next/headers';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type {
  MyProfile,
  UpdateProfileRequest,
} from '@/services/user/user.types';

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

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as UpdateProfileRequest;

    const data = await serverFetch<MyProfile>('/users/me', {
      method: 'PATCH',
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

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    await serverFetch('/users/me', {
      method: 'DELETE',
    });

    // 백엔드 탈퇴 처리 성공 후 쿠키 제거
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
