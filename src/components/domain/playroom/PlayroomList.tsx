import Link from 'next/link';

import type { PlayroomCardData } from '@/services/playroom/playroom.types';

import PlayroomListItem from './PlayroomListItem';

export default function PlayroomList({ data }: { data: PlayroomCardData[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {data.map(({ id, ...playroom }) => (
        <li key={id}>
          <Link href={`/playroom/${id}`} className="block w-full">
            <PlayroomListItem {...playroom} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
