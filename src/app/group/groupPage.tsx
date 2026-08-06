'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import { getGroups } from '@/services/group/group.api';

type GroupRequest = {
  id: number;
  requester: string;
  message: string;
  meta: string;
  actionLabel: string;
  gradientClassName: string;
};

// 그룹 카드 배경은 API가 내려주지 않으므로 id 기반으로 고정 배정합니다.
const GROUP_GRADIENTS = [
  'from-[#6366f1] to-[#c084fc]',
  'from-[#38bdf8] to-[#4f46e5]',
  'from-[#34d399] to-[#a3e635]',
  'from-[#d946ef] to-[#6366f1]',
];

function getGroupGradientClassName(id: number) {
  return GROUP_GRADIENTS[id % GROUP_GRADIENTS.length];
}

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
  } = useQuery({
    queryKey: ['groups'],
    queryFn: () => getGroups(),
  });

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
              className="bg-bg-card flex flex-col gap-3 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  aria-hidden
                  className={`size-10 shrink-0 rounded-full bg-linear-to-br ${request.gradientClassName}`}
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
              </div>
              <div className="flex justify-end gap-2">
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

        {isGroupsError && (
          <p className="text-sm text-red-500" role="alert">
            그룹 목록을 불러오는데 실패하였습니다.
          </p>
        )}

        {groupsData && groupsData.items.length === 0 && (
          <p className="text-text-secondary text-sm">
            아직 속한 그룹이 없습니다.
          </p>
        )}

        {groupsData && groupsData.items.length > 0 && (
          <div className="flex flex-col gap-3">
            {groupsData.items.map((group) => (
              <Link
                key={group.id}
                href={`/group/${group.id}`}
                className="bg-bg-card hover:bg-input flex items-center gap-4 rounded-2xl p-3 transition-colors"
              >
                <div
                  aria-hidden
                  className={`size-14 shrink-0 rounded-xl bg-linear-to-br ${getGroupGradientClassName(group.id)}`}
                />
                <div className="min-w-0">
                  <h3 className="text-text-primary truncate text-base font-semibold">
                    {group.title}
                  </h3>
                  <p className="text-text-secondary mt-0.5 text-sm">
                    멤버 {group.memberCount}명 · 플레이리스트{' '}
                    {group.playlistCount}개
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
