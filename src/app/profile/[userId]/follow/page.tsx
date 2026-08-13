import { notFound } from 'next/navigation';

import FollowPage from './_components/FollowPage';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { userId } = await params;
  const { tab } = await searchParams;

  const profileId = Number(userId);
  if (!Number.isInteger(profileId)) {
    notFound();
  }

  return (
    <FollowPage
      userId={profileId}
      initialTab={tab === 'following' ? 'following' : 'followers'}
    />
  );
}
