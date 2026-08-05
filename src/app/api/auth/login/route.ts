import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { SessionUser } from '@/services/user/user.types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = await serverFetch<
      SessionUser & {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
      }
    >('/auth/login', {
      method: 'POST',
      body,
    });

    const cookieStore = await cookies();
    cookieStore.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: data.expiresIn,
    });
    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });

    const user: SessionUser = {
      id: data.id,
      nickname: data.nickname,
      email: data.email,
      image: data.image,
    };

    return Response.json(user);
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
