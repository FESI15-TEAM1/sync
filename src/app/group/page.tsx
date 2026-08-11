import { redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { MyProfile } from '@/services/user/user.types';

import GroupPage from './_components/groupPage';

export default async function GroupListPage() {
  try {
    await serverFetch<MyProfile>('/users/me', { method: 'GET' });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      redirect('/group/login-required');
    }
    throw error;
  }

  return <GroupPage />;
}
