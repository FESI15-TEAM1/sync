import { clientFetch } from '@/lib/http/client-fetch';

import type {
  CreateGroupRequest,
  CreateGroupResponse,
  GroupDetailResponse,
  UpdateGroupRequest,
} from './group.types';

// 그룹 생성
export function createGroup(data: CreateGroupRequest) {
  return clientFetch<CreateGroupResponse>('/group', {
    method: 'POST',
    body: data,
  });
}

// 그룹 수정(부분 수정, 그룹장만 가능)
export function updateGroup(groupId: string, data: UpdateGroupRequest) {
  return clientFetch<GroupDetailResponse>(`/group/${groupId}`, {
    method: 'PATCH',
    body: data,
  });
}
