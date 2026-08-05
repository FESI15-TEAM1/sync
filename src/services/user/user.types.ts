// 로그인 응답 / 헤더·세션용 최소 유저 정보
export type SessionUser = {
  id: number;
  nickname: string;
  image: string | null;
  email: string;
};

// GET /users/me — 내 프로필(이메일·카운트 포함)
export type MyProfile = SessionUser & {
  description: string | null;
  followerCount: number;
  followingCount: number;
  groupCount: number;
  playlistCount: number;
};

// GET /users/{userId} — 타 유저 공개 프로필
export type UserProfile = {
  id: number;
  nickname: string;
  image: string | null;
  description: string | null;
  followerCount: number;
  followingCount: number;
  playlistCount: number;
  isFollowing: boolean;
};

// PATCH /users/me — 변경할 필드만 전송
export type UpdateProfileRequest = {
  nickname?: string;
  image?: string;
  description?: string;
};
