'use client';

import { useGetPlayroomList } from '@/app/stage/_hooks/useGetPlayroomList';
import Button from '@/components/Button';
import PlayroomList from '@/components/domain/playroom/PlayroomList';
import { type PlayroomListItemResponse } from '@/services/playroom/playroom.types';

import StatusContainer from './StatusContainer';

export default function LivePlayroomListView() {
  const {
    data,
    isPending,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    refetch,
    loadMoreRef,
  } = useGetPlayroomList();

  if (isPending) {
    return (
      <StatusContainer>
        <p className="text-disabled">생성된 플레이룸을 불러오는 중입니다!</p>
      </StatusContainer>
    );
  }

  // 첫 페이지부터 실패해 보여줄 목록이 없는 경우입니다.
  // 자동 재시도를 두지 않으므로 여기서 직접 다시 시도할 수단을 제공합니다.
  // 다음 페이지 실패는 이미 받은 목록을 유지한 채 하단에서 따로 안내합니다.
  if (!data) {
    return (
      <StatusContainer>
        <p className="text-red-500" role="alert">
          플레이룸을 불러오는데 실패하였습니다.
        </p>
        <Button
          size="sm"
          variant="outline"
          isDisabled={isFetching}
          onClick={() => refetch()}
        >
          {isFetching ? '불러오는 중...' : '다시 시도'}
        </Button>
      </StatusContainer>
    );
  }

  const playrooms = dedupeById(data.pages.flatMap((page) => page.items));

  if (playrooms.length === 0) {
    return (
      <StatusContainer>
        <p className="text-text-secondary text-center">
          현재 라이브 중인 플레이룸이 존재하지 않습니다.
          <br /> 우측 하단의{' '}
          <span className="text-text-primary font-bold">플러스 버튼</span>을
          눌러 플레이룸을 생성해보세요!
        </p>
      </StatusContainer>
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
