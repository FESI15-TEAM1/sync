import { clientFetch } from '@/lib/http/client-fetch';

import type { CreateGroupRequest, CreateGroupResponse } from './group.types';

// 그룹 생성
export function createGroup(data: CreateGroupRequest) {
  return clientFetch<CreateGroupResponse>('/group', {
    method: 'POST',
    body: data,
  });
}
