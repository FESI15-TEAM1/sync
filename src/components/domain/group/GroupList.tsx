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
