import { apiClient } from '@/lib/http/client-fetch';

import type { MeResponse } from './user.types';

// 로그인한 유저 정보 조회
export function getMe() {
  return apiClient<MeResponse>('/users/me');
}
