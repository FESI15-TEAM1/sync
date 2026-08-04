'use server';

import { request } from '@/lib/http/server-fetch';
import type { SessionUser } from '@/services/user/user.types';

type LoginResponse = SessionUser & {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

type LoginFormState = {
  success: boolean;
  message?: string;
  user?: SessionUser;
}

export async function loginAction(formData: FormData): Promise<LoginFormState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return {
      success: false,
      message: '이메일과 비밀번호를 입력해주세요.',
    };
  }

  try {
    //server-fetch의 request()에서
    //accessToken / refreshToken을  HttpOnly 쿠키에 저장한다.
    const result = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    //클라이언트ㅔ에는 사용자 정보만 전달
    //토큰을 HttpOnly쿠키에 저장되어 있으므로
    //클라이언트로 직접 반환하지 않는다.
    return {
      success: true,
      user: {
        id: result.id,
        nickname: result.nickname,
        email: result.email,
        image: result.image

      },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
    };
  }
}
