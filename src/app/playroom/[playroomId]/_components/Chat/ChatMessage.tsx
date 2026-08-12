import Image from 'next/image';

import mookImage from '@/assets/images/mook.jpg';

export default function ChatMessage({
  username,
  userImage,
  message,
}: {
  username: string;
  userImage?: string | null;
  message: string;
}) {
  return (
    <>
      <span className="flex flex-row items-start gap-2">
        <Image
          src={userImage ?? mookImage.src}
          alt="유저 프로필"
          width={20}
          height={20}
          className="bg-bg-card rounded-full"
        />
        <p className="text-text-primary py-0.5 text-xs">{username}</p>
        <p className="text-text-secondary py-0.5 text-xs">{message}</p>
      </span>
    </>
  );
}
