import Image from 'next/image';

import CrownIcon from '@/assets/icons/crown.svg';
import SyncLogo from '@/assets/icons/syncLogo.svg';

export default function ChatMessage({
  username,
  userImage,
  message,
  isHostMessage,
}: {
  username: string;
  userImage?: string | null;
  message: string;
  isHostMessage: boolean;
}) {
  return (
    <>
      <span className="flex flex-row items-start gap-2">
        <span className="relative h-5 w-5">
          {userImage ? (
            <Image
              src={userImage}
              alt="유저 프로필"
              fill
              className="bg-bg-card rounded-full object-cover"
            />
          ) : (
            <div className="bg-disabled h-full w-full rounded-full">
              <SyncLogo className="text-text-secondary absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2" />
            </div>
          )}

          {isHostMessage && (
            <span className="absolute bottom-[70%] left-[60%]">
              <CrownIcon
                width={12}
                height={12}
                className="rotate-30 text-yellow-500"
              />
            </span>
          )}
        </span>

        <p className="text-text-primary py-0.5 text-xs">
          {isHostMessage ? (
            <span className="bg-primary rounded-xl px-2 py-0.5">
              {username}
            </span>
          ) : (
            username
          )}
        </p>
        <p className="text-text-secondary py-0.5 text-xs break-all">
          {message}
        </p>
      </span>
    </>
  );
}
