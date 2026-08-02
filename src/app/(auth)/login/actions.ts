'use server';

import { request } from '@/lib/http/server-fetch';
import type { SessionUser } from '@/services/user/user.types';

type LoginFormState = {
  success: boolean;
  message?: string;
  user?: SessionUser;
};

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
    // 토큰은 백엔드가 Set-Cookie로 내려주고, server-fetch의 request()가
    // 우리 도메인의 accessToken/refreshToken 쿠키로 동기화해준다.
    const user = await request<SessionUser>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    return {
      success: true,
      user,
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
