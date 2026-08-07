import { clientFetch } from '@/lib/http/client-fetch';

import type { CreateGroupRequest, CreateGroupResponse } from './group.types';

// 그룹 생성
export function createGroup(data: CreateGroupRequest) {
  return clientFetch<CreateGroupResponse>('/group', {
    method: 'POST',
    body: data,
  });
}

// 그룹 탈퇴 / 강퇴
export function leaveGroup(groupId: number, userId: number) {
  return clientFetch<null>(`/group/${groupId}/members/${userId}`, {
    method: 'DELETE',
  });
}
