import Image from 'next/image';

import CrownIcon from '@/assets/icons/crown.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';

export interface MemberType {
  userId: number;
  username: string;
  // 프로필 이미지가 없거나 탈퇴한 유저면 null 입니다.
  userImage?: string | null;
}

export default function MemberItem({
  userId,
  username,
  userImage,
  isHostMember,
  onMemberClick,
}: MemberType & {
  isHostMember: boolean;
  onMemberClick: (userId: number) => void;
}) {
  return (
    <>
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onMemberClick(userId)}
          className="inline-flex cursor-pointer items-center gap-2 text-left *:hover:underline"
        >
          <span className="relative h-8 w-8">
            {userImage ? (
              <Image
                src={userImage}
                alt=""
                fill
                className="bg-bg-card rounded-full object-cover"
              />
            ) : (
              <div className="bg-disabled h-full w-full rounded-full">
                <SyncLogo className="text-text-secondary absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}
          </span>

          <p className="text-text-primary text-sm">{username}</p>
        </button>

        {isHostMember && (
          <span title="방장">
            <CrownIcon width={20} height={20} className="text-yellow-500" />
          </span>
        )}
      </span>
    </>
  );
}
