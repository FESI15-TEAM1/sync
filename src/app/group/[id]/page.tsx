import GroupDetail from './_components/GroupDetail';

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string }>;
}) {
  const { id } = await params;
  const { role } = await searchParams;

  return <GroupDetail groupId={id} isLeader={role === 'leader'} />;
}
