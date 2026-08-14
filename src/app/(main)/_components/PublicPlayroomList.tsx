'use client';

import Link from 'next/link';

import PlayroomList from '@/components/domain/playroom/PlayroomList';

import {
  MAIN_PLAYROOM_COUNT,
  useGetMainPlayrooms,
} from '../_hooks/useMainQueries';

export default function PublicPlayroomList() {
  const { data: playrooms, isPending, isError } = useGetMainPlayrooms();

  if (isPending) return <PublicPlayroomSkeleton />;

  if (isError)
    return (
      <p className="text-sm text-red-500" role="alert">
        플레이룸을 불러오는데 실패하였습니다.
      </p>
    );

  if (playrooms.length === 0)
    return (
      <p className="text-text-secondary text-sm">
        현재 라이브 중인 플레이룸이 없습니다. 플레이룸을 개설하고 친구들과 함께
        즐겨보세요!&nbsp;
        <Link href="/playroom/add" className="text-primary hover:underline">
          생성하기
        </Link>
      </p>
    );

  return <PlayroomList data={playrooms} />;
}

function PublicPlayroomSkeleton({ count = MAIN_PLAYROOM_COUNT }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{ animationDelay: `${index * 100}ms` }}
          className="bg-border h-24 animate-pulse rounded-2xl"
        />
      ))}
    </div>
  );
}
