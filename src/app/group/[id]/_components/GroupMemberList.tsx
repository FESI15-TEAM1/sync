'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import Crown from '@/assets/icons/crown.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';
import ConfirmModal from '@/components/ConfirmModal';
import ProfilePreviewModal from '@/components/domain/user/ProfilePreviewModal';
import { APIError } from '@/lib/http/error';
import { leaveGroup } from '@/services/group/group.api';
import type { GroupMemberResponse } from '@/services/group/group.types';

import { groupMembersQueryKey } from '../_hooks/useGroupMembersQuery';

type GroupMemberListProps = {
  groupId: number;
  isLeader: boolean;
  members: GroupMemberResponse[];
  isLoading: boolean;
  isError: boolean;
};

export default function GroupMemberList({
  groupId,
  isLeader,
  members,
  isLoading,
  isError,
}: GroupMemberListProps) {
  const queryClient = useQueryClient();
  const [previewUserId, setPreviewUserId] = useState<number | null>(null);
  const [kickTarget, setKickTarget] = useState<GroupMemberResponse | null>(
    null,
  );
  const [kickErrorMessage, setKickErrorMessage] = useState<string | null>(null);

  const { mutate: kickMember, variables: kickingUserId } = useMutation({
    mutationFn: (userId: number) => leaveGroup(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupMembersQueryKey(groupId),
      });
      setKickTarget(null);
    },
    onError: (error) => {
      setKickErrorMessage(
        error instanceof APIError
          ? error.message
          : '멤버 강퇴 중 오류가 발생했습니다.',
      );
    },
  });

  const handleKick = (member: GroupMemberResponse) => {
    if (kickingUserId !== undefined) return;
    setKickErrorMessage(null);
    setKickTarget(member);
  };

  const handleConfirmKick = () => {
    if (!kickTarget) return;
    kickMember(kickTarget.userId);
  };

  const handleCloseKickModal = () => {
    if (kickingUserId !== undefined) return;
    setKickTarget(null);
    setKickErrorMessage(null);
  };

  if (isLoading) {
    return (
      <p className="text-text-secondary py-10 text-center text-sm">
        불러오는 중...
      </p>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="py-10 text-center text-sm text-red-500">
        멤버 목록을 불러오지 못했습니다.
      </p>
    );
  }

  if (members.length === 0) {
    return (
      <p className="text-text-secondary py-10 text-center text-sm">
        멤버가 없습니다.
      </p>
    );
  }

  return (
    <>
      <ul className="mx-auto flex w-10/12 flex-col gap-2">
        {[...members].reverse().map((member) => (
          <li
            className="group bg-bg-card relative flex w-full items-center gap-2 rounded-2xl p-3"
            key={member.userId}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <Link
                href={`/profile/${member.userId}`}
                onClick={(e) => {
                  e.preventDefault();
                  setPreviewUserId(member.userId);
                }}
                className="mr-4 shrink-0"
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={`${member.nickname} 프로필`}
                    width={44}
                    height={44}
                    className="size-11 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="bg-input flex size-11 shrink-0 items-center justify-center rounded-full"
                    aria-hidden
                  >
                    <SyncLogo width={22} height={22} />
                  </div>
                )}
              </Link>

              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setPreviewUserId(member.userId);
                }}
                href={`/profile/${member.userId}`}
              >
                <p className="text-text-primary text-md truncate">
                  {member.nickname}
                </p>
              </Link>

              {member.isOwner && (
                <Crown
                  className="shrink-0 text-yellow-500"
                  width={20}
                  height={20}
                  aria-label="방장"
                />
              )}
            </div>
            {isLeader && !member.isOwner && (
              <button
                type="button"
                onClick={() => handleKick(member)}
                disabled={kickingUserId === member.userId}
                className="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer text-xs text-red-600 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
              >
                {kickingUserId === member.userId
                  ? '내보내는 중...'
                  : '내보내기'}
              </button>
            )}
          </li>
        ))}
      </ul>

      <ProfilePreviewModal
        userId={previewUserId}
        isOpen={previewUserId !== null}
        onClose={() => setPreviewUserId(null)}
      />

      <ConfirmModal
        isOpen={kickTarget !== null}
        title={`${kickTarget?.nickname}님을 내보내시겠습니까?`}
        confirmLabel="내보내기"
        confirmingLabel="내보내는 중..."
        isConfirming={
          kickTarget !== null && kickingUserId === kickTarget.userId
        }
        errorMessage={kickErrorMessage}
        destructive
        onConfirm={handleConfirmKick}
        onClose={handleCloseKickModal}
      />
    </>
  );
}
