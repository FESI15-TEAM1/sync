import { clientFetch } from '@/lib/http/client-fetch';
import type { SessionUser } from '@/services/user/user.types';

import type {
  LoginRequest,
  NicknameCheckResponse,
  SignupRequest,
} from './auth.types';

// 회원가입
export function signup(data: SignupRequest) {
  return clientFetch('/auth/signup', {
    method: 'POST',
    body: data,
  });
}

// 닉네임 중복 확인
export function checkNickname(nickname: string) {
  return clientFetch<NicknameCheckResponse>('/auth/nickname-check', {
    method: 'GET',
    params: { nickname },
  });
}

// 이메일 인증 코드 발송
export function requestEmailVerification(email: string) {
  return clientFetch('/auth/email-verify-request', {
    method: 'POST',
    body: {
      email,
    },
  });
}

// 이메일 인증 코드 확인
export function confirmEmailVerification(email: string, code: string) {
  return clientFetch('/auth/email-verify-confirm', {
    method: 'POST',
    body: {
      email,
      code,
    },
  });
}

// 로그인
export function login(data: LoginRequest) {
  return clientFetch<SessionUser>('/auth/login', {
    method: 'POST',
    body: data,
  });
}

// 로그아웃
export function logout() {
  return clientFetch('/auth/logout', {
    method: 'POST',
  });
}
