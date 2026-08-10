import { clientFetch } from '@/lib/http/client-fetch';

import type {
  CreateGroupJoinRequestPayload,
  CreateGroupRequest,
  CreateGroupResponse,
  EditGroupPlaylistsRequest,
  EditGroupPlaylistsResponse,
  GetGroupPlaylistsParams,
  GetGroupPlaylistsResponse,
  GetGroupsParams,
  GetGroupsResponse,
  GetPublicGroupsParams,
  GetPublicGroupsResponse,
  GroupDetailResponse,
  GroupRequestResponse,
  UpdateGroupRequest,
} from './group.types';

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

// 공개 그룹 참여 요청(승인제, 그룹장에게 전달됨)
export function requestJoinGroup(groupId: number) {
  return clientFetch<GroupRequestResponse>('/group-requests', {
    method: 'POST',
    body: {
      sourceType: 'group',
      sourceId: groupId,
    } satisfies CreateGroupJoinRequestPayload,
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

// 그룹 플레이리스트 목록
export function getGroupPlaylists(
  groupId: number,
  { cursor, limit }: GetGroupPlaylistsParams = {},
) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetGroupPlaylistsResponse>(
    `/groups/${groupId}/playlists`,
    {
      method: 'GET',
      params: Object.keys(params).length > 0 ? params : undefined,
    },
  );
}

// 그룹 플레이리스트 일괄 편집
export function editGroupPlaylists(
  groupId: number,
  data: EditGroupPlaylistsRequest,
) {
  return clientFetch<EditGroupPlaylistsResponse>(
    `/groups/${groupId}/playlists`,
    {
      method: 'PUT',
      body: data,
    },
  );
}
