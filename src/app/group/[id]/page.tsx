import GroupDetail from './_components/GroupDetail';

// TODO: 실제 API 연동 시 로그인 세션(쿠키/토큰)과 groupId로 서버에서 멤버십을
// 조회하는 호출로 교체한다. isLeader/isJoined는 클라이언트가 보낸 값(쿼리 등)을
// 절대 신뢰하지 말고, 매 요청마다 서버에서 재검증해야 한다.
async function getViewerMembership(
  groupId: number,
  devOverride?: { role?: string; joined?: string },
) {
  if (process.env.NODE_ENV !== 'production' && devOverride) {
    return {
      isLeader: devOverride.role === 'leader',
      isJoined: devOverride.joined !== 'false',
    };
  }

  // mock: 실제로는 그룹 상세 조회 응답에서 파생되어야 한다.
  return { isLeader: false, isJoined: true };
}

export default async function GroupDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ role?: string; joined?: string }>;
}) {
  const { id } = await params;
  const groupId = Number(id);
  const devOverride = await searchParams;

  const { isLeader, isJoined } = await getViewerMembership(
    groupId,
    devOverride,
  );

  return <GroupDetail groupId={groupId} isLeader={isLeader} />;
}
