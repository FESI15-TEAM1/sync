import { clientFetch } from '@/lib/http/client-fetch';

import type { AccessTokenResponse } from './token.types';

// accessToken 조회 (WebSocket 연결 헤더용)
export function getAccessToken() {
  return clientFetch<AccessTokenResponse>('/auth/token', {
    method: 'GET',
  });
}
