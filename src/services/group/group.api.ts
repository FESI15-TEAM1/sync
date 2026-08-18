import { clientFetch } from '@/lib/http/client-fetch';

import type {
  CreateGroupJoinRequestPayload,
  CreateGroupRequest,
  CreateGroupResponse,
  EditGroupPlaylistsRequest,
  EditGroupPlaylistsResponse,
  GetGroupMembersParams,
  GetGroupMembersResponse,
  GetGroupPlaylistsParams,
  GetGroupPlaylistsResponse,
  GetGroupsParams,
  GetGroupsResponse,
  GetPublicGroupsParams,
  GetPublicGroupsResponse,
  GroupDetailResponse,
  GroupMemberResponse,
  GroupPlaylistResponse,
  GroupRequestResponse,
  HighlightGroupPlaylistRequest,
  JoinGroupByCodeRequest,
  JoinGroupByInviteCodeRequest,
  UpdateGroupRequest,
} from './group.types';

// 그룹 생성
export function createGroup(data: CreateGroupRequest) {
  return clientFetch<CreateGroupResponse>('/groups', {
    method: 'POST',
    body: data,
  });
}

// 그룹 탈퇴 / 강퇴
export function leaveGroup(groupId: number, userId: number) {
  return clientFetch<null>(`/groups/${groupId}/members/${userId}`, {
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
    //이 값이 이 타입의 조건을 만족하는지 검사하되, 값의 구체적인 타입 정보는 유지해줘.
  });
}

// 그룹 수정(부분 수정, 그룹장만 가능)
export function updateGroup(groupId: string, data: UpdateGroupRequest) {
  return clientFetch<GroupDetailResponse>(`/groups/${groupId}`, {
    method: 'PATCH',
    body: data,
  });
}

// 그룹 삭제(그룹장만 가능)
export function deleteGroup(groupId: number) {
  return clientFetch<null>(`/groups/${groupId}`, {
    method: 'DELETE',
  });
}

// 내 그룹 목록
export function getGroups({ cursor, limit }: GetGroupsParams = {}) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetGroupsResponse>('/groups', {
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

// 그룹 멤버 목록
export function getGroupMembers(
  groupId: number,
  { cursor, limit }: GetGroupMembersParams = {},
) {
  const params: Record<string, string> = {};

  if (cursor) params.cursor = cursor;
  if (limit !== undefined) params.limit = String(limit);

  return clientFetch<GetGroupMembersResponse>(`/groups/${groupId}/members`, {
    method: 'GET',
    params: Object.keys(params).length > 0 ? params : undefined,
  });
}

// 초대코드로 그룹 즉시 가입(그룹 ID를 아는 경우)
export function joinGroupByCode(groupId: number, data: JoinGroupByCodeRequest) {
  return clientFetch<GroupMemberResponse>(`/groups/${groupId}/members`, {
    method: 'POST',
    body: data,
  });
}

// 초대코드로 그룹 즉시 가입(그룹 ID 불필요, 공개·비공개 모두 가능)
export function joinGroupByInviteCode(data: JoinGroupByInviteCodeRequest) {
  return clientFetch<GroupDetailResponse>('/groups/join', {
    method: 'POST',
    body: data,
  });
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

// 그룹 플레이리스트 개별 제거(본인이 담은 것이거나 그룹장만 가능)
export function removeGroupPlaylist(groupId: number, playlistId: number) {
  return clientFetch<null>(`/groups/${groupId}/playlists/${playlistId}`, {
    method: 'DELETE',
  });
}

// 그룹 플레이리스트 하이라이트(상단 고정, 그룹장만 가능)
export function highlightGroupPlaylist(
  groupId: number,
  playlistId: number,
  data: HighlightGroupPlaylistRequest,
) {
  return clientFetch<GroupPlaylistResponse>(
    `/groups/${groupId}/playlists/${playlistId}`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}
