import { clientFetch } from '@/lib/http/client-fetch';

import type {
  MyProfile,
  UpdateProfileRequest,
  UserProfile,
} from './user.types';

// 로그인한 유저 정보 조회
export function getMe() {
  return clientFetch<MyProfile>('/users/me');
}

// 유저 공개 프로필 조회
export function getUser(userId: number) {
  return clientFetch<UserProfile>(`/users/${userId}`);
}

// 내 프로필 수정
export function updateMe(data: UpdateProfileRequest) {
  return clientFetch<MyProfile>('/users/me', {
    method: 'PATCH',
    body: data,
  });
}
