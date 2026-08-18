'use client';

import Link from 'next/link';

import PlayroomList from '@/components/domain/playroom/PlayroomList';

import { useGetMainPlayrooms } from '../_hooks/useMainQueries';

export default function PublicPlayroomList() {
  const { data: playrooms, isPending, isError } = useGetMainPlayrooms();

  if (isPending)
    return (
      <>
        <p className="text-text-secondary text-sm" role="status">
          플레이룸을 불러오고 있습니다...
        </p>
      </>
    );

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
        <Link
          href="/playroom/add"
          className="text-primary font-bold hover:underline"
        >
          생성하기
        </Link>
      </p>
    );

  return <PlayroomList data={playrooms} />;
}
