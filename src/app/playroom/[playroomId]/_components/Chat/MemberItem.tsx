import Image from 'next/image';
import Link from 'next/link';

import mookImage from '@/assets/images/mook.jpg';

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
}: MemberType) {
  return (
    <>
      <span>
        <Link
          href={`/profile/${userId}`}
          className="inline-flex items-center gap-2 *:hover:underline"
          target="_blank"
        >
          <span className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={userImage ?? mookImage.src}
              alt=""
              fill
              className="bg-bg-card object-cover"
            />
          </span>

          <p className="text-text-primary text-sm">{username}</p>
        </Link>
      </span>
    </>
  );
}
