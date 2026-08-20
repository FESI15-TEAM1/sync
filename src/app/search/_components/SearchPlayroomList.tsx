import Link from 'next/link';

import type { SearchPlayroomItem } from '@/services/search/search.types';

import SearchPlayroomListItem from './SearchPlayroomListItem';

export default function SearchPlayroomList({
  data,
}: {
  data: SearchPlayroomItem[];
}) {
  return (
    <ul className="flex flex-col gap-2">
      {data.map(({ id, ...playroom }) => (
        <li key={id}>
          <Link href={`/playroom/${id}`} className="block w-full">
            <SearchPlayroomListItem {...playroom} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
