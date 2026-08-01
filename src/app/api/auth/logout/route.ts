import { cookies } from 'next/headers';

import { clearTokenCookies, request } from '@/lib/http/server-fetch';

export async function POST() {
  const cookieStore = await cookies();

  try {
    await request('/auth/logout', { method: 'POST' });
  } catch {
    // 백엔드 로그아웃 실패여도 로컬 세션은 종료한다.
  }

  clearTokenCookies(cookieStore);

  return new Response(null, { status: 204 });
}
