const API_URL = process.env.NEXT_PUBLIC_BE_API_URL;

type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

//회원가입
export async function signup(data: SignupRequest) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '회원가입에 실패했습니다.');
  }
  return response.json();
}
//이메일 인증 코드 발송
export async function requestEmailVerification(email: string) {
  const response = await fetch(`${API_URL}/auth/email-verify-request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '인증코드 발송에 실패했습니다.');
  }
  return response.json();
}

//이메일 인증코드 확인
export async function confirmEmailVerification(email: string, code: string) {
  const response = await fetch(`${API_URL}/auth/email-verify-confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '인증에 실패했습니다.');
  }

  return response.json();
}

//로그인
export async function login(data: LoginRequest) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '로그인에 실패했습니다.');
  }
  return response.json();
}
