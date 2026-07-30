import { notFound } from 'next/navigation';

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

  return <ProfileEditPage profileId={profileId} />;
}
