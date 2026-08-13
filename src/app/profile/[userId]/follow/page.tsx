import { notFound } from 'next/navigation';

import FollowPage from './_components/FollowPage';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
      initialTab={
        typeof tab === 'string' && tab === 'following'
          ? 'following'
          : 'followers'
      }
    />
  );
}
