import Link from 'next/link';

import type { SearchGroupItem } from '@/services/search/search.types';

import SearchGroupListItem from './SearchGroupListItem';

export default function SearchGroupList({
  data,
}: {
  data: SearchGroupItem[];
}) {
  return (
    <ul className="flex flex-col gap-3">
      {data.map((group) => (
        <li key={group.id}>
          <Link href={`/group/${group.id}`} className="block w-full">
            <SearchGroupListItem {...group} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
