import { notFound } from 'next/navigation';

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

  let me: MyProfile | null = null;
  try {
    me = await serverFetch<MyProfile>('/users/me', { method: 'GET' });
  } catch {
    me = null;
  }

  if (!me || me.id !== profileId) {
    notFound();
  }

  return <ProfileEditPage profile={me} />;
}
