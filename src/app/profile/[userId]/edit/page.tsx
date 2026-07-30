import ProfileEditPage from './_components/ProfileEdit';

export default async function ProfileEdit({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <ProfileEditPage profileId={Number(userId)} />;
}
