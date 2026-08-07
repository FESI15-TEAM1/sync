'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import Button from '@/components/Button';
import GroupList from '@/components/domain/group/GroupList';
import { APIError } from '@/lib/http/error';
import { getGroups } from '@/services/group/group.api';

const GROUP_PAGE_SIZE = 10;
// 바닥에 닿기 전에 미리 다음 페이지를 불러와 스크롤이 끊기지 않게 합니다.
const LOAD_MORE_ROOT_MARGIN = '200px';

type GroupRequest = {
  id: number;
  requester: string;
  message: string;
  meta: string;
  actionLabel: string;
  gradientClassName: string;
};

const MOCK_REQUESTS: GroupRequest[] = [
  {
    id: 1,
    requester: '도윤',
    message: '"비 오는 날 감성" 플레이리스트에서 그룹 생성 요청을 했습니다.',
    meta: '게시글에서 참여 신청 · 3분 전',
    actionLabel: '그룹 선택하기',
    gradientClassName: 'from-[#6366f1] to-[#c084fc]',
  },
  {
    id: 2,
    requester: '도윤',
    message: '"인디밴드 러버스" 그룹에 참여 요청을 했습니다.',
    meta: '게시글에서 참여 신청 · 3분 전',
    actionLabel: '수락하기',
    gradientClassName: 'from-[#38bdf8] to-[#4f46e5]',
  },
];

export default function GroupPage() {
  const router = useRouter();

  const {
    data: groupsData,
    isPending: isGroupsPending,
    isError: isGroupsError,
    error: groupsError,
    fetchNextPage,
    hasNextPage,
    isFetching: isGroupsFetching,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ['groups'],
    queryFn: ({ pageParam }) =>
      getGroups({ cursor: pageParam, limit: GROUP_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    // nextCursor가 null이면 마지막 페이지입니다.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const groups = groupsData?.pages.flatMap((page) => page.items) ?? [];

  const isGroupsAuthError =
    isGroupsError &&
    groupsError instanceof APIError &&
    groupsError.status === 401;

  useEffect(() => {
    if (isGroupsAuthError) {
      router.replace('/group/login-required');
    }
  }, [isGroupsAuthError, router]);

  // 목록 끝의 감지용 요소가 화면에 들어오면 다음 페이지를 이어서 불러옵니다.
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isGroupsFetching || isFetchNextPageError)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isGroupsFetching) fetchNextPage();
      },
      { rootMargin: LOAD_MORE_ROOT_MARGIN },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isGroupsFetching, isFetchNextPageError, fetchNextPage]);

  const handleReject = (id: number) => {
    // 요청 거절 API 연동
    console.log('요청 거절', id);
  };

  const handleAccept = (id: number) => {
    // 요청 수락/그룹 선택 API 연동
    console.log('요청 수락', id);
  };

  const handleJoinByCode = () => {
    // 코드로 참여하기 플로우 연동
    console.log('코드로 참여하기 버튼 클릭');
  };

  return (
    <div className="mx-auto flex flex-col gap-8 px-5 py-6">
      {MOCK_REQUESTS.length > 0 && (
        <div className="flex flex-col gap-3">
          {MOCK_REQUESTS.map((request) => (
            <div
              key={request.id}
              className="bg-bg-card flex items-center gap-3 rounded-2xl p-4"
            >
              <div
                aria-hidden
                className={`size-14 shrink-0 rounded-full bg-linear-to-br ${request.gradientClassName}`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-text-primary text-sm leading-snug">
                  <span className="font-semibold">{request.requester}</span>
                  님이 {request.message}
                </p>
                <p className="text-text-secondary mt-1 text-xs">
                  {request.meta}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  isDisabled={false}
                  size="md"
                  type="button"
                  onClick={() => handleReject(request.id)}
                  className="text-text-secondary hover:text-text-primary cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors"
                >
                  거절
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  isDisabled={false}
                  type="button"
                  onClick={() => handleAccept(request.id)}
                  className="bg-primary hover:bg-secondary text-text-primary cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold transition-colors"
                >
                  {request.actionLabel}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="md"
          isDisabled={false}
          onClick={handleJoinByCode}
        >
          코드로 참여하기
        </Button>
        <Button
          variant="primary"
          size="md"
          isDisabled={false}
          onClick={() => router.push('/group/add')}
        >
          그룹 만들기
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-text-primary text-xl font-bold">내 그룹</h2>

        {isGroupsPending && (
          <p className="text-text-secondary text-sm">
            그룹 목록을 불러오는 중입니다...
          </p>
        )}

        {isGroupsError && !isGroupsAuthError && (
          <p className="text-sm text-red-500" role="alert">
            그룹 목록을 불러오는데 실패하였습니다.
          </p>
        )}

        {groupsData && groups.length === 0 && (
          <p className="text-text-secondary text-sm">
            아직 속한 그룹이 없습니다.
          </p>
        )}

        {groupsData && groups.length > 0 && <GroupList data={groups} />}

        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="flex flex-col items-center justify-center gap-2 py-4"
          >
            {isFetchingNextPage && (
              <p className="text-text-secondary text-sm">
                그룹을 더 불러오는 중입니다...
              </p>
            )}

            {isFetchNextPageError && (
              <>
                <p className="text-sm text-red-500" role="alert">
                  그룹을 더 불러오는데 실패하였습니다.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  isDisabled={false}
                  type="button"
                  onClick={() => fetchNextPage()}
                >
                  다시 시도
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
