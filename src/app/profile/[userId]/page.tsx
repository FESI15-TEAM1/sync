import { notFound } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { request } from '@/lib/http/server-fetch';
import type { MyProfile, UserProfile } from '@/services/user/user.types';

import Profile from './_components/Profile';

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

async function fetchUserProfile(profileId: number) {
  try {
    return await request<UserProfile>(`/users/${profileId}`, {
      method: 'GET',
    });
  } catch (error) {
    if (error instanceof APIError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

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

  const me = await fetchMyProfile();

  if (me && me.id === profileId) {
    return <Profile isOwn profile={me} />;
  }

  const profile = await fetchUserProfile(profileId);
  if (!profile) {
    notFound();
  }

  return <Profile isOwn={false} profile={profile} />;
}
