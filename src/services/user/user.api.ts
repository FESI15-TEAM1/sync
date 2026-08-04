import { apiClient } from '@/lib/http/client-fetch';

import type {
  MyProfile,
  UpdateProfileRequest,
  UserProfile,
} from './user.types';

// 로그인한 유저 정보 조회
export function getMe() {
  return apiClient<MyProfile>('/users/me');
}

// 유저 공개 프로필 조회
export function getUser(userId: number) {
  return apiClient<UserProfile>(`/users/${userId}`);
}

// 내 프로필 수정
export function updateMe(data: UpdateProfileRequest) {
  return apiClient<MyProfile>('/users/me', {
    method: 'PATCH',
    body: data,
  });
}
