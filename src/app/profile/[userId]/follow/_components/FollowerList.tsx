import Image from 'next/image';

import SyncLogo from '@/assets/icons/syncLogo.svg';
import Button from '@/components/Button';

import type { FollowUser } from '../_hooks/useFollowQuery';

type Props = {
  users: FollowUser[];
  onToggleFollow: (userId: number) => void;
  onUserClick: (userId: number) => void;
  pendingUserId?: number | null;
};

export default function FollowerList({
  users,
  onToggleFollow,
  onUserClick,
  pendingUserId,
}: Props) {
  if (users.length === 0) {
    return (
      <p className="text-text-secondary py-10 text-center text-sm">
        아직 팔로워가 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center justify-between gap-3 py-3"
        >
          <button
            type="button"
            onClick={() => onUserClick(user.id)}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={`${user.nickname} 프로필`}
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
            <p className="text-text-primary truncate text-sm">
              {user.nickname}
            </p>
          </button>

          <Button
            type="button"
            size="sm"
            variant={user.isFollowing ? 'outline' : 'primary'}
            isDisabled={pendingUserId === user.id}
            onClick={() => onToggleFollow(user.id)}
          >
            {user.isFollowing ? '언팔로우' : '팔로우'}
          </Button>
        </li>
      ))}
    </ul>
  );
}
