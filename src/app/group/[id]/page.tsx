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

  // TODO: 임시 — 리더 UI 확인용. 끝나면 role === 'leader' 로 되돌리기  isJoined도 추가함
  return <GroupDetail groupId={id} isJoined />;
}
