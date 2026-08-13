'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import {
  editGroupPlaylists,
  getGroupMembers,
  getGroupPlaylists,
  leaveGroup,
  requestJoinGroup,
} from '@/services/group/group.api';
import type { GroupDetailResponse } from '@/services/group/group.types';
import { getUserPlaylists } from '@/services/playlist/playlist.api';
import type { MyPlaylistItem } from '@/services/playlist/playlistCard.type';

import GroupDetailTabs, { type DetailTab } from './GroupDetailTabs';
import GroupLeaveModal from './GroupLeaveModal';
import GroupMemberList from './GroupMemberList';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

// 그룹 상세 화면에서 한 번에 다룰 플레이리스트 최대 개수(스펙상 페이지 최대치)
const PLAYLIST_QUERY_LIMIT = 50;
// 커서로 끝까지 모아 전체 목록을 확보하기 위한 최대 페이지 수
const MAX_PLAYLIST_PAGES = 10;

async function fetchAllUserPlaylists(userId: number) {
  const items: MyPlaylistItem[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PLAYLIST_PAGES; page++) {
    const data = await getUserPlaylists(userId, {
      cursor,
      limit: PLAYLIST_QUERY_LIMIT,
    });

    items.push(...data.items);

    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return items;
}

type GroupDetailProps = {
  groupId: number;
  group: GroupDetailResponse;
};

export type EditableGroupInfo = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string | null;
};

export default function GroupDetail({ groupId, group }: GroupDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);

  const isLeader = currentUser?.id === group.owner.userId;

  const [isEditPlaylistsOpen, setIsEditPlaylistsOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('playlists');

  const groupInfo: EditableGroupInfo = {
    name: group.title,
    description: group.description,
    isPublic: group.isPublic,
    coverImage: group.image,
  };
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // 그룹 멤버 목록
  const groupMembersQuery = useQuery({
    queryKey: ['group', groupId, 'members'],
    queryFn: () => getGroupMembers(groupId, { limit: PLAYLIST_QUERY_LIMIT }),
  });

  // 그룹에 추가된 플레이리스트
  const groupPlaylistsQuery = useQuery({
    queryKey: ['group', groupId, 'playlists'],
    queryFn: () => getGroupPlaylists(groupId, { limit: PLAYLIST_QUERY_LIMIT }),
  });

  const playlists: EditablePlaylist[] = (
    groupPlaylistsQuery.data?.items ?? []
  ).map((item) => ({
    id: item.id,
    title: item.title,
    trackCount: item.trackCount,
    artist: item.owner.nickname,
    image: item.image,
    ownerId: item.owner.userId,
  }));

  // 내가 그룹에 추가할 수 있는 플레이리스트(내 플레이리스트 중 아직 추가되지 않은 것)
  const myPlaylistsQuery = useQuery({
    queryKey: ['user', currentUser?.id, 'playlists'],
    queryFn: () => fetchAllUserPlaylists(currentUser!.id),
    enabled: (isLeader || group.isMember) && currentUser !== null,
  });

  const addedPlaylistIds = new Set(playlists.map((item) => item.id));
  const availablePlaylists: EditablePlaylist[] = (myPlaylistsQuery.data ?? [])
    .filter((item) => !addedPlaylistIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      trackCount: item.trackCount,
      artist: currentUser?.nickname ?? '',
      image: item.image,
      ownerId: currentUser?.id ?? 0,
    }));

  const isPlaylistsLoading =
    groupPlaylistsQuery.isPending ||
    ((isLeader || group.isMember) && myPlaylistsQuery.isPending);
  //그룹 정보 수정
  const handleEditGroupInfo = () => {
    router.push(`/group/${groupId}/edit`);
  };
  //플레이리스트 편집
  const handleEditPlaylists = () => {
    if (isSavingPlaylists || isPlaylistsLoading) {
      console.log('click');
      return;
    }

    setSaveErrorMessage(null);
    setIsEditPlaylistsOpen(true);
  };

  //그룹 탈퇴
  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  const { mutate: savePlaylists, isPending: isSavingPlaylists } = useMutation({
    mutationFn: (nextPlaylists: EditablePlaylist[]) =>
      editGroupPlaylists(groupId, {
        playlistIds: nextPlaylists.map((item) => item.id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['group', groupId, 'playlists'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user', currentUser?.id, 'playlists'],
      });
      setIsEditPlaylistsOpen(false);
    },
    onError: (error) => {
      setSaveErrorMessage(
        error instanceof APIError
          ? error.message
          : '플레이리스트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const handleSavePlaylists = (nextPlaylists: EditablePlaylist[]) => {
    savePlaylists(nextPlaylists);
  };

  const leaveGroupMutation = useMutation({
    mutationFn: () => {
      if (!currentUser) throw new Error('로그인이 필요합니다.');
      return leaveGroup(groupId, currentUser.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsLeaveGroupOpen(false);
      router.push('/group');
    },
    onError: (error) => {
      if (error instanceof APIError) {
        console.error(error.message);
        alert(error.message);
        return;
      }

      console.error(error);
      alert('그룹 탈퇴 중 오류가 발생했습니다.');
    },
  });

  const handleConfirmLeave = () => {
    if (!currentUser) return;
    leaveGroupMutation.mutate();
  };

  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);

  const joinGroupMutation = useMutation({
    mutationFn: () => requestJoinGroup(groupId),
    onSuccess: () => {
      setJoinErrorMessage(null);
    },
    onError: (error) => {
      setJoinErrorMessage(
        error instanceof APIError
          ? error.message
          : '참여 요청에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const handleJoinGroup = () => {
    if (joinGroupMutation.isPending) return;
    joinGroupMutation.mutate();
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
        <div className="flex items-start gap-4">
          {groupInfo.coverImage ? (
            <Image
              src={groupInfo.coverImage}
              alt={groupInfo.name}
              width={80}
              height={80}
              className="size-20 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div
              className="bg-input size-20 shrink-0 rounded-2xl"
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-text-primary text-xl font-bold">
                {groupInfo.name}
              </h1>
              {/* 케밥 메뉴: 가입한 그룹(멤버/그룹장)일 때만 노출 */}
              {(isLeader || group.isMember) && (
                <KebabModal>
                  {isLeader ? (
                    <>
                      <KebabModal.Item onClick={handleEditGroupInfo}>
                        그룹 정보 수정
                      </KebabModal.Item>
                      <KebabModal.Item onClick={handleEditPlaylists}>
                        플레이리스트 편집
                      </KebabModal.Item>
                    </>
                  ) : (
                    <>
                      <KebabModal.Item onClick={handleEditPlaylists}>
                        내 플레이리스트 편집
                      </KebabModal.Item>
                      <KebabModal.Item
                        variant="danger"
                        onClick={handleLeaveGroup}
                      >
                        그룹 탈퇴하기
                      </KebabModal.Item>
                    </>
                  )}
                </KebabModal>
              )}
            </div>
            <p className="text-text-secondary mt-1 text-sm">
              멤버 {group.memberCount}명 · 플레이리스트 {group.playlistCount}개
            </p>
            {group.inviteCode && (
              <p className="text-text-secondary mt-0.5 text-sm">
                초대코드 {group.inviteCode}
              </p>
            )}
          </div>
        </div>

        {/* 비가입 유저: 참여 요청 버튼 */}
        {group.isPublic && !isLeader && !group.isMember && (
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              isDisabled={
                joinGroupMutation.isPending || joinGroupMutation.isSuccess
              }
              onClick={handleJoinGroup}
              className="w-full rounded-full"
            >
              {joinGroupMutation.isSuccess ? '참여 요청 완료' : '참여하기'}
            </Button>
            {joinErrorMessage && (
              <p role="alert" className="text-sm text-red-500">
                {joinErrorMessage}
              </p>
            )}
          </div>
        )}

        {saveErrorMessage && (
          <p role="alert" className="text-sm text-red-500">
            {saveErrorMessage}
          </p>
        )}

        {/* 플레이리스트 편집 모달 */}
        {isEditPlaylistsOpen && (
          <PlaylistEditModal
            isOpen={isEditPlaylistsOpen}
            addedPlaylists={playlists}
            availablePlaylists={availablePlaylists}
            isLeader={isLeader}
            currentUserId={currentUser?.id ?? null}
            onClose={() => setIsEditPlaylistsOpen(false)}
            onSave={handleSavePlaylists}
          />
        )}

        {/* 그룹 탈퇴 모달 */}
        <GroupLeaveModal
          isOpen={isLeaveGroupOpen}
          groupName={groupInfo.name}
          onClose={() => setIsLeaveGroupOpen(false)}
          onConfirm={handleConfirmLeave}
        />
      </div>
      <GroupDetailTabs activeTab={activeTab} onChange={setActiveTab} />
      <div className="mx-auto mt-4 w-full max-w-md px-5">
        {activeTab === 'playlists' ? (
          groupPlaylistsQuery.isPending ? (
            <p className="text-text-secondary text-sm">
              플레이리스트를 불러오는 중입니다...
            </p>
          ) : groupPlaylistsQuery.isError ? (
            <p role="alert" className="text-sm text-red-500">
              플레이리스트를 불러오는데 실패했습니다.
            </p>
          ) : (
            <div className="flex flex-row flex-wrap gap-3">
              {playlists.map((playlist) => (
                <>
                  <Link
                    href={`/playlist/detail/${playlist.id}`}
                    key={playlist.id}
                  >
                    <PlaylistCard
                      img={playlist.image}
                      title={playlist.title}
                      trackCount={playlist.trackCount}
                    />
                  </Link>
                </>
              ))}
            </div>
          )
        ) : (
          <GroupMemberList
            members={groupMembersQuery.data?.items ?? []}
            isLoading={groupMembersQuery.isPending}
            isError={groupMembersQuery.isError}
          />
        )}
      </div>
    </>
  );
}
