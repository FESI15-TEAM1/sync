import { notFound } from 'next/navigation';

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

  const props = {
    profileId,
    nickname: 'JPOP 의 신',
    email: 'test@test.com',
    bio: '자기소개 입니다 웋히히',
    groupCount: 2,
    playlistCount: 14,
    followerCount: 10,
    followingCount: 50,
  };

  return <Profile {...props} />;
}
