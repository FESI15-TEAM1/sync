import { request } from '@/app/api/youtube/client';

type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

// 응답 바디가 비어있거나 JSON이 아닐 수 있으므로 안전하게 파싱
async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

//회원가입
export async function signup(data: SignupRequest) {
  const response = await fetch(`/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

  const result = await parseJson(response);
  if (!response.ok) {
    throw new Error(result?.message || '회원가입에 실패했습니다.');
  }
  return result;
}
//이메일 인증 코드 발송
export async function requestEmailVerification(email: string) {
  const response = await fetch(`/auth/email-verify-request`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  const result = await parseJson(response);
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(result?.message || '인증코드 발송에 실패했습니다.');
  }
  return result;
}

//이메일 인증코드 확인
export async function confirmEmailVerification(email: string, code: string) {
  const response = await fetch(`/auth/email-verify-confirm`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      code,
    }),
  });

  const result = await parseJson(response);
  if (!response.ok) {
    throw new Error(result?.message || '인증에 실패했습니다.');
  }

  return result;
}

//로그인
export async function login(data: LoginRequest) {
  const response = await fetch(`/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await parseJson(response);
  if (!response.ok) {
    throw new Error(result?.message || '로그인에 실패했습니다.');
  }
  return result;
}
