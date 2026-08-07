import { redirect } from 'next/navigation';

import { APIError } from '@/lib/http/error';
import { serverFetch } from '@/lib/http/server-fetch';
import type { GroupDetailResponse } from '@/services/group/group.types';

import EditPage from './_components/EditPage';

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let group: GroupDetailResponse;

  try {
    group = await serverFetch<GroupDetailResponse>(`/groups/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    if (error instanceof APIError && error.status === 401) redirect('/login');
    throw error;
  }

  return (
    <EditPage
      groupId={id}
      initialGroup={{
        title: group.title,
        description: group.description,
        image: group.image,
        isPublic: group.isPublic,
      }}
    />
  );
}
