import Image from 'next/image';
import Link from 'next/link';

import mookImage from '@/assets/images/mook.jpg';

export default function Member({
  userId,
  username,
  userImage,
}: {
  userId: number;
  username: string;
  userImage?: string;
}) {
  return (
    <>
      <Link href={`/profile/${userId}`}>
        <span className="flex items-center gap-2">
          <Image
            src={userImage ?? mookImage.src}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
          <p className="text-text-primary text-sm">{username}</p>
        </span>
      </Link>
    </>
  );
}
