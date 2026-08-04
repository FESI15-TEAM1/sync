'use client';

import Link from 'next/link';

import ListItem from './ListItem';

export type PlayroomListData = {
  id: number;
  title: string;
  description: string;
  hashtags: string[];
  listenerCount: number;
  host: string;
};

export default function PlayroomList({ data }: { data: PlayroomListData[] }) {
  return (
    <>
      <ul className="flex flex-col gap-2">
        {data.map((d, idx) => (
          <Link key={idx} href={`/playroom/${d.id}`} className="w-full">
            <ListItem
              userCount={d.listenerCount}
              title={d.title}
              description={d.description}
              genres={d.hashtags}
              owner={d.host}
            />
          </Link>
        ))}
      </ul>
    </>
  );
}
