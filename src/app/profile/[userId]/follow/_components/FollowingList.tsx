import Image from 'next/image';

import SyncLogo from '@/assets/icons/syncLogo.svg';
import Button from '@/components/Button';

import type { FollowUser } from './FollowPage';

type Props = {
  users: FollowUser[];
  onToggleFollow: (userId: number) => void;
};

export default function FollowingList({ users, onToggleFollow }: Props) {
  if (users.length === 0) {
    return (
      <p className="text-text-secondary py-10 text-center text-sm">
        아직 팔로잉하는 사람이 없습니다.
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
          <div className="flex min-w-0 items-center gap-3">
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
          </div>

          <Button
            type="button"
            size="sm"
            variant={user.isFollowing ? 'outline' : 'primary'}
            onClick={() => onToggleFollow(user.id)}
          >
            {user.isFollowing ? '언팔로우' : '팔로우'}
          </Button>
        </li>
      ))}
    </ul>
  );
}
