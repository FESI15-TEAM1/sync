import Image from 'next/image';
import Link from 'next/link';

import CrownIcon from '@/assets/icons/crown.svg';

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
}: MemberType & { isHostMember: boolean }) {
  return (
    <>
      <span className="flex items-center gap-2">
        <Link
          href={`/profile/${userId}`}
          className="inline-flex items-center gap-2 *:hover:underline"
          target="_blank"
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
              <div className="bg-disabled h-full w-full rounded-full"></div>
            )}
          </span>

          <p className="text-text-primary text-sm">{username}</p>
        </Link>

        {isHostMember && (
          <span title="방장">
            <CrownIcon width={20} height={20} className="text-yellow-500" />
          </span>
        )}
      </span>
    </>
  );
}
