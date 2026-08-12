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
        <span className="relative h-5 w-5 overflow-hidden rounded-full">
          <Image
            src={userImage ?? mookImage.src}
            alt="유저 프로필"
            fill
            className="bg-bg-card object-cover"
          />
        </span>

        <p className="text-text-primary py-0.5 text-xs">{username}</p>
        <p className="text-text-secondary py-0.5 text-xs">{message}</p>
      </span>
    </>
  );
}
