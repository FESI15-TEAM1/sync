'use client';

import { useGetMyPlayroomList } from '@/app/stage/_hooks/useGetMyPlayroomList';
import Button from '@/components/Button';
import PlayroomList from '@/components/domain/playroom/PlayroomList';

import StatusContainer from './StatusContainer';

/**
 * 내가 만든 플레이룸 목록입니다.
 * 개설 상한이 5개라 페이지네이션 없이 한 번에 보여줍니다.
 * 항목의 isLive 가 false 면 내가 자리를 비운 방이며, 10분 안에 돌아오지 않으면 사라집니다.
 */
export default function MyPlayroomListView() {
  const { playrooms, isLoading, isFetching, isError, refetch } =
    useGetMyPlayroomList();

  if (isLoading) {
    return (
      <StatusContainer>
        <p className="text-disabled">내가 만든 플레이룸을 불러오는 중입니다!</p>
      </StatusContainer>
    );
  }

  // 자동 재시도를 두지 않으므로 여기서 직접 다시 시도할 수단을 제공합니다.
  if (isError || !playrooms) {
    return (
      <StatusContainer>
        <p className="text-red-500" role="alert">
          내가 만든 플레이룸을 불러오는데 실패하였습니다.
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

  if (playrooms.length === 0) {
    return (
      <StatusContainer>
        <p className="text-text-secondary text-center">
          아직 내가 만든 플레이룸이 없습니다.
          <br /> 우측 하단의{' '}
          <span className="text-text-primary font-bold">플러스 버튼</span>을
          눌러 플레이룸을 생성해보세요!
        </p>
      </StatusContainer>
    );
  }

  return <PlayroomList data={playrooms} />;
}
