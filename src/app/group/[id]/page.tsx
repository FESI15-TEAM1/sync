import { notFound, redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { GroupDetailResponse } from '@/services/group/group.types';

import GroupDetail from './_components/GroupDetail';

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const groupId = Number(id);

  if (!Number.isInteger(groupId)) {
    notFound();
  }

  let group: GroupDetailResponse;
  try {
    group = await serverFetch<GroupDetailResponse>(`/groups/${groupId}`, {
      method: 'GET',
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 401) redirect('/login');
      if (error.status === 404) notFound();
      if (error.status === 403) {
        return (
          <p className="text-text-secondary mx-auto max-w-md px-5 py-10 text-center text-sm">
            비공개 그룹입니다.
          </p>
        );
      }
    }
    throw error;
  }

  return <GroupDetail groupId={groupId} group={group} />;
}
