import { cookies } from 'next/headers';

import { serverFetch } from '@/lib/http/server-fetch';

export async function POST() {
  const cookieStore = await cookies();

  try {
    await serverFetch('/auth/logout', {
      method: 'POST',
    });
  } finally {
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
  }

  return new Response(null, {
    status: 204,
  });
}
