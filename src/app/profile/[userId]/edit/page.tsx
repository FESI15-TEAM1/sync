import { notFound, redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { request } from '@/lib/http/server-fetch';
import type { MyProfile } from '@/services/user/user.types';

import ProfileEditPage from './_components/ProfileEdit';

async function fetchMyProfile() {
  try {
    return await request<MyProfile>('/users/me', { method: 'GET' });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export default async function ProfileEdit({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const profileId = Number(userId);
  if (!Number.isInteger(profileId)) {
    notFound();
  }

  const me = await fetchMyProfile();

  if (!me) {
    redirect('/login');
  }

  if (me.id !== profileId) {
    redirect(`/profile/${me.id}/edit`);
  }

  return <ProfileEditPage profile={me} />;
}
