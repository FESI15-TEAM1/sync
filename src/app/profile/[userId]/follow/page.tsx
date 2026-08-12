import { notFound } from 'next/navigation';

import FollowPage from './_components/FollowPage';

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const profileId = Number(userId);
  if (!Number.isInteger(profileId)) {
    notFound();
  }

  return <FollowPage userId={profileId} />;
}
