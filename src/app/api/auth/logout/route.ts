import { cookies } from 'next/headers';

import { serverFetch } from '@/lib/http/server-fetch';

export async function POST() {
  const cookieStore = await cookies();

  try {
    await serverFetch('/auth/logout', {
      method: 'POST',
    });
  } catch {
    // 백엔드 로그아웃 실패해도 쿠키는 제거한다.
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return new Response(null, {
    status: 204,
  });
}
