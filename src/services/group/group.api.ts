import { clientFetch } from '@/lib/http/client-fetch';

import type {
  CreateGroupRequest,
  CreateGroupResponse,
  GetGroupsParams,
  GetGroupsResponse,
  GetPublicGroupsParams,
  GetPublicGroupsResponse,
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

// 공개 그룹 목록
export function getPublicGroups({ cursor, limit }: GetPublicGroupsParams = {}) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetPublicGroupsResponse>('/groups/public', {
    method: 'GET',
    params: Object.keys(params).length > 0 ? params : undefined,
  });
}
