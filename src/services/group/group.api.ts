import { clientFetch } from '@/lib/http/client-fetch';

import type {
  CreateGroupRequest,
  CreateGroupResponse,
  GetGroupsParams,
  GetGroupsResponse,
} from './group.types';

// 그룹 생성
export function createGroup(data: CreateGroupRequest) {
  return clientFetch<CreateGroupResponse>('/group', {
    method: 'POST',
    body: data,
  });
}

// 내 그룹 목록
export function getGroups({ cursor, limit }: GetGroupsParams = {}) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetGroupsResponse>('/group', {
    method: 'GET',
    params: Object.keys(params).length > 0 ? params : undefined,
  });
}
