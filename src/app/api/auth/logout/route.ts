import { cookies } from 'next/headers';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export async function POST() {
  const cookieStore = await cookies();

  try {
    // 백엔드 로그아웃 요청
    // 성공하면 refreshToken 무효화 처리
    await serverFetch('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // 백엔드 로그아웃 실패 여부와 관계없이
    // 클라이언트 인증 쿠키 제거
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    // 백엔드에서 내려준 에러 응답 유지
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

    // 예상하지 못한 서버 오류
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

  // 로그아웃 성공 시 쿠키 제거
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return new Response(null, {
    status: 204,
  });
}
