'use client';

import { useRouter } from 'next/navigation';
import { type MouseEvent, useState } from 'react';

import ProfilePreviewModal from '@/components/domain/user/ProfilePreviewModal';

import type { MemberType } from './MemberItem';
import MemberItem from './MemberItem';

/** 프로필 미리보기 모달의 이동 버튼 라벨. 이 버튼 클릭만 가로챕니다. */
const PROFILE_BUTTON_LABEL = '프로필';

export default function Members({
  members,
  hostId,
  onBeforeProfileNavigate,
}: {
  members: MemberType[];
  hostId: number | null;
  /** 프로필로 이동하기 직전에 호출됩니다. `false` 를 반환하면 이동하지 않습니다. */
  onBeforeProfileNavigate?: (navigate: () => void) => boolean;
}) {
  const router = useRouter();
  const [previewUserId, setPreviewUserId] = useState<number | null>(null);

  // 방장을 맨 앞에 놓습니다. sort 는 안정 정렬이라 나머지는 서버가 준 순서 그대로입니다.
  const sortedMembers = members
    .slice()
    .sort((a, b) => Number(b.userId === hostId) - Number(a.userId === hostId));

  // 미리보기 모달의 프로필 버튼은 앵커가 아니라 `router.push` 를 쓰는 버튼이라
  // 방장 이탈 가드의 앵커 클릭 캡처에 걸리지 않습니다. 공용 모달을 건드리지 않고
  // 여기서 캡처 단계로 가로채, 이동 여부를 가드에 먼저 물어봅니다.
  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!onBeforeProfileNavigate || previewUserId === null) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest('button');
    if (button?.textContent?.trim() !== PROFILE_BUTTON_LABEL) return;

    event.preventDefault();
    event.stopPropagation();

    const navigate = () => router.push(`/profile/${previewUserId}`);

    if (!onBeforeProfileNavigate(navigate)) return;

    navigate();
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-y-auto"
      onClickCapture={handleClickCapture}
    >
      <div className="grid grid-cols-2 gap-2 p-4">
        {sortedMembers.map((member) => (
          <MemberItem
            userId={member.userId}
            username={member.username}
            userImage={member.userImage}
            key={member.userId}
            isHostMember={member.userId === hostId}
            onMemberClick={setPreviewUserId}
          />
        ))}
      </div>

      <ProfilePreviewModal
        userId={previewUserId}
        isOpen={previewUserId !== null}
        onClose={() => setPreviewUserId(null)}
      />
    </div>
  );
}
