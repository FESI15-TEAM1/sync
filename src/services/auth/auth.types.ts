export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type NicknameCheckResponse = {
  available: boolean;
};

// 응답 본문 없음 (204 No Content)
export type LogoutResponse = null;
