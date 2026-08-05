import { notFound } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { MyProfile } from '@/services/user/user.types';

import ProfileEditPage from './_components/ProfileEdit';

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

  let me: MyProfile;
  try {
    me = await serverFetch<MyProfile>('/users/me', { method: 'GET' });
  } catch (error) {
    if (error instanceof APIError && (error.status === 401 || error.status === 403)) {
      notFound();
    }
    throw error;
  }

  if (me.id !== profileId) {
    notFound();
  }

  return <ProfileEditPage profile={me} />;
}
