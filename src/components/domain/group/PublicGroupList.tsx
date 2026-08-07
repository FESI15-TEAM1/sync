'use client';

import { useQuery } from '@tanstack/react-query';

import { getPublicGroups } from '@/services/group/group.api';

import GroupList from './GroupList';

const PUBLIC_GROUP_LIST_LIMIT = 6;

export default function PublicGroupList() {
  const {
    data,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['groups', 'public'],
    queryFn: () => getPublicGroups({ limit: PUBLIC_GROUP_LIST_LIMIT }),
  });

  if (isPending) {
    return (
      <p className="text-text-secondary text-sm">
        그룹 목록을 불러오는 중입니다...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500" role="alert">
        그룹 목록을 불러오는데 실패하였습니다.
      </p>
    );
  }

  if (data.items.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        아직 등록된 그룹이 없습니다.
      </p>
    );
  }

  return <GroupList data={data.items} />;
}
