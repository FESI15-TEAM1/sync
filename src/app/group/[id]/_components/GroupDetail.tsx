'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useMyPlaylistsQuery } from '@/app/group/_hooks/useMyPlaylistsQuery';
import BackButton from '@/components/common/BackButton';
import { useUserStore } from '@/providers/user-store-provider';
import type { GroupDetailResponse } from '@/services/group/group.types';

import { useCopyInviteCode } from '../_hooks/useCopyInviteCode';
import { useGroupMembersQuery } from '../_hooks/useGroupMembersQuery';
import { useGroupPlaylists } from '../_hooks/useGroupPlaylists';
import { useJoinGroup } from '../_hooks/useJoinGroup';
import { useSaveGroupPlaylists } from '../_hooks/useSaveGroupPlaylists';
import GroupDetailTabs, { type DetailTab } from './GroupDetailTabs';
import GroupHeader from './GroupHeader';
import GroupJoinBanner from './GroupJoinBanner';
import GroupLeaveModal from './GroupLeaveModal';
import GroupMemberList from './GroupMemberList';
import GroupPlaylistGrid from './GroupPlaylistGrid';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

type GroupDetailProps = {
  groupId: number;
  group: GroupDetailResponse;
};

export default function GroupDetail({ groupId, group }: GroupDetailProps) {
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);

  const isLeader = currentUser?.id === group.owner.userId;
  const isMember = isLeader || group.isMember;

  const [isEditPlaylistsOpen, setIsEditPlaylistsOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('playlists');

  const { showCopyToast, copyErrorMessage, handleCopyInviteCode } =
    useCopyInviteCode(group.inviteCode);

  const groupMembersQuery = useGroupMembersQuery(groupId);

  const { playlists, isPending: isGroupPlaylistsPending } =
    useGroupPlaylists(groupId);

  // 내가 그룹에 추가할 수 있는 플레이리스트(내 플레이리스트 중 아직 추가되지 않은 것)
  const myPlaylistsQuery = useMyPlaylistsQuery(
    currentUser?.id,
    isMember && currentUser !== null,
  );

  const addedPlaylistIds = new Set(playlists.map((item) => item.id));
  const availablePlaylists: EditablePlaylist[] = (myPlaylistsQuery.data ?? [])
    .filter((item) => !addedPlaylistIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      trackCount: item.trackCount,
      owner: currentUser?.nickname ?? '',
      image: item.image,
      ownerId: currentUser?.id ?? 0,
    }));

  const isPlaylistsLoading =
    isGroupPlaylistsPending || (isMember && myPlaylistsQuery.isPending);

  const {
    handleSavePlaylists,
    isSavingPlaylists,
    saveErrorMessage,
    resetSaveError,
  } = useSaveGroupPlaylists(groupId, currentUser?.id, () =>
    setIsEditPlaylistsOpen(false),
  );

  const { handleJoinGroup, isJoinPending, isJoinSuccess, joinErrorMessage } =
    useJoinGroup(groupId);

  //그룹 정보 수정
  const handleEditGroupInfo = () => {
    router.push(`/group/${groupId}/edit`);
  };

  //플레이리스트 편집
  const handleEditPlaylists = () => {
    if (isSavingPlaylists || isPlaylistsLoading) return;

    resetSaveError();
    setIsEditPlaylistsOpen(true);
  };

  //그룹 탈퇴
  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-hidden={!showCopyToast}
        className={`bg-bg-card fixed top-25 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white transition-all duration-300 ${showCopyToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'} `}
      >
        {showCopyToast ? '초대코드가 복사되었습니다.' : ''}
      </div>
      <div className="mx-auto flex w-full flex-1 flex-col gap-5 px-5 py-6">
        <BackButton />

        <GroupHeader
          group={group}
          isLeader={isLeader}
          copyErrorMessage={copyErrorMessage}
          onEditGroupInfo={handleEditGroupInfo}
          onEditPlaylists={handleEditPlaylists}
          onLeaveGroup={handleLeaveGroup}
          onCopyInviteCode={handleCopyInviteCode}
        />

        <GroupJoinBanner
          group={group}
          isLeader={isLeader}
          isPending={isJoinPending}
          isSuccess={isJoinSuccess}
          errorMessage={joinErrorMessage}
          onJoin={handleJoinGroup}
        />

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
          groupId={groupId}
          groupName={group.title}
          onClose={() => setIsLeaveGroupOpen(false)}
        />
      </div>
      <GroupDetailTabs activeTab={activeTab} onChange={setActiveTab} />
      <div className="mx-auto mt-4 w-full px-5">
        {activeTab === 'playlists' ? (
          <GroupPlaylistGrid
            groupId={groupId}
            isLeader={isLeader}
            currentUserId={currentUser?.id ?? null}
          />
        ) : (
          <GroupMemberList
            groupId={groupId}
            isLeader={isLeader}
            members={groupMembersQuery.data?.items ?? []}
            isLoading={groupMembersQuery.isPending}
            isError={groupMembersQuery.isError}
          />
        )}
      </div>
    </>
  );
}
