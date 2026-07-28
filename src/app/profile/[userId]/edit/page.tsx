import ProfileEditPage from './_components/ProfileEdit';

export default async function ProfileEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileEditPage profileId={id} />;
}
