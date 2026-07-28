import GroupDetail from './_components/GroupDetail';

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string; joined?: string }>;
}) {
  const { id } = await params;
  const { role, joined } = await searchParams;

  // TODO: 임시 — 리더/가입 UI 확인용. 끝나면 실제 값으로 되돌리기
  return (
    <GroupDetail
      groupId={Number(id)}
      isLeader={role === 'leader'}
      isJoined={joined !== 'false'}
    />
  );
}
