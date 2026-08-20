import { notFound } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { MyProfile, UserProfile } from '@/services/user/user.types';

import Profile from './_components/Profile';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const profileId = Number(userId);
  if (!Number.isInteger(profileId)) {
    notFound();
  }

  let me: MyProfile | null = null;
  try {
    me = await serverFetch<MyProfile>('/users/me', { method: 'GET' });
  } catch {
    me = null;
  }

  if (me && me.id === profileId) {
    return <Profile isOwn={true} profile={me} />;
  }

  let profile: UserProfile;
  try {
    profile = await serverFetch<UserProfile>(`/users/${profileId}`, {
      method: 'GET',
    });
  } catch (error) {
    if (error instanceof APIError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return <Profile isOwn={false} profile={profile} />;
}
