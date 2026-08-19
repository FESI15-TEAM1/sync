import Link from 'next/link';

import type { GroupSummary } from '@/services/group/group.types';

import GroupListItem from './GroupListItem';
export default function GroupList({ data }: { data: GroupSummary[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {data.map((group) => (
        <li key={group.id}>
          <Link href={`/group/${group.id}`} className="block w-full">
            <GroupListItem {...group} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function GroupListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          style={{ animationDelay: `${i * 100}ms` }}
          className="bg-bg-card flex animate-pulse items-center gap-4 rounded-2xl p-3"
        >
          <div className="bg-border size-14 shrink-0 rounded-xl" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="bg-border h-4 w-1/3 rounded" />
            <div className="bg-border h-3.5 w-1/2 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}
