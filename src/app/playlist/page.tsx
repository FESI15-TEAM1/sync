import { redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';

export default async function PlayList() {
  const userId = await getCurrentUserId();

  if (userId === null) {
    redirect('/login');
  }

  redirect(`/playlist/${userId}`);
}

async function getCurrentUserId() {
  try {
    const me = await serverFetch<{ id: number }>('/users/me', {
      method: 'GET',
    });
    return me.id;
  } catch (error) {
    if (error instanceof APIError) return null;
    throw error;
  }
}
