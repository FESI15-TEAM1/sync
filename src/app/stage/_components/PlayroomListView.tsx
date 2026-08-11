'use client';

import { type ReactNode } from 'react';

import { useGetPlayroomList } from '@/app/stage/_hooks/useGetPlayroomList';
import Button from '@/components/Button';
import PlayroomList from '@/components/domain/playroom/PlayroomList';
import { type PlayroomListItemResponse } from '@/services/playroom/playroom.types';

export default function PlayroomListView() {
  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    loadMoreRef,
  } = useGetPlayroomList();

  if (isPending) {
    return (
      <StatusMessage className="text-text-secondary">
        현재 라이브 중인 플레이룸을 불러오는 중입니다!
      </StatusMessage>
    );
  }

  // 첫 페이지부터 실패해 보여줄 목록이 없는 경우입니다.
  // 다음 페이지 실패는 이미 받은 목록을 유지한 채 하단에서 따로 안내합니다.
  if (!data) {
    return (
      <StatusMessage className="text-red-500">
        플레이룸을 불러오는데 실패하였습니다.
      </StatusMessage>
    );
  }

  const playrooms = dedupeById(data.pages.flatMap((page) => page.items));

  if (playrooms.length === 0) {
    return (
      <StatusMessage className="text-text-primary">
        현재 라이브 중인 플레이룸이 존재하지 않습니다.
      </StatusMessage>
    );
  }

  return (
    <>
      <PlayroomList data={playrooms} />

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex flex-col items-center justify-center gap-2 py-4"
        >
          {isFetchingNextPage && (
            <p className="text-text-secondary text-sm">
              플레이룸을 더 불러오는 중입니다...
            </p>
          )}

          {isFetchNextPageError && (
            <>
              <p className="text-sm text-red-500" role="alert">
                플레이룸을 더 불러오는데 실패하였습니다.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchNextPage()}
              >
                다시 시도
              </Button>
            </>
          )}
        </div>
      )}
    </>
  );
}

/**
 * 라이브 목록은 방송이 끝난 방이 실시간으로 빠지면서 커서 경계가 밀릴 수 있어,
 * 페이지 사이에 같은 방이 중복으로 들어오는 경우를 걸러냅니다.
 */
function dedupeById(playrooms: PlayroomListItemResponse[]) {
  return Array.from(
    new Map(playrooms.map((playroom) => [playroom.id, playroom])).values(),
  );
}

function StatusMessage({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-(--main-content-full-height) items-center justify-center">
      <p className={className}>{children}</p>
    </div>
  );
}
