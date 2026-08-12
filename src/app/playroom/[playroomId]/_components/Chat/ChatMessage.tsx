import Image from 'next/image';

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
          {userImage ? (
            <Image
              src={userImage}
              alt="유저 프로필"
              fill
              className="bg-bg-card object-cover"
            />
          ) : (
            <div className="bg-disabled h-full w-full"></div>
          )}
        </span>

        <p className="text-text-primary py-0.5 text-xs">{username}</p>
        <p className="text-text-secondary py-0.5 text-xs">{message}</p>
      </span>
    </>
  );
}
