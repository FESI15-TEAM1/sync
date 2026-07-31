import { apiClient } from '@/lib/http/client-fetch';
import type { MeResponse } from '@/services/user/user.types';

import type { LoginRequest, SignupRequest } from './auth.types';

// 회원가입
export function signup(data: SignupRequest) {
  return apiClient('/auth/signup', {
    method: 'POST',
    body: data,
  });
}

// 이메일 인증 코드 발송
export function requestEmailVerification(email: string) {
  return apiClient('/auth/email-verify-request', {
    method: 'POST',
    body: {
      email,
    },
  });
}

// 이메일 인증 코드 확인
export function confirmEmailVerification(email: string, code: string) {
  return apiClient('/auth/email-verify-confirm', {
    method: 'POST',
    body: {
      email,
      code,
    },
  });
}

// 로그인
export function login(data: LoginRequest) {
  return apiClient<MeResponse>('/auth/login', {
    method: 'POST',
    body: data,
  });
}
