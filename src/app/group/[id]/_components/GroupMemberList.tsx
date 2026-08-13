'use client';

import Image from 'next/image';
import { useState } from 'react';

import Crown from '@/assets/icons/crown.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';
import ProfilePreviewModal from '@/components/domain/user/ProfilePreviewModal';
import type { GroupMemberResponse } from '@/services/group/group.types';

type GroupMemberListProps = {
  members: GroupMemberResponse[];
  isLoading: boolean;
  isError: boolean;
};

export default function GroupMemberList({
  members,
  isLoading,
  isError,
}: GroupMemberListProps) {
  const [previewUserId, setPreviewUserId] = useState<number | null>(null);

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
      <ul className="flex flex-col">
        {members.map((member) => (
          <li className="mx-auto" key={member.userId}>
            <button
              type="button"
              onClick={() => setPreviewUserId(member.userId)}
              className="flex w-full cursor-pointer items-center gap-3 py-3 text-left"
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
              <p className="text-text-primary min-w-0 flex-1 truncate pr-20 pl-2 text-sm">
                {member.nickname}
              </p>
              {member.isOwner && (
                <Crown
                  className="shrink-0 text-yellow-500"
                  width={20}
                  height={20}
                  aria-label="방장"
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      <ProfilePreviewModal
        userId={previewUserId}
        isOpen={previewUserId !== null}
        onClose={() => setPreviewUserId(null)}
      />
    </>
  );
}
