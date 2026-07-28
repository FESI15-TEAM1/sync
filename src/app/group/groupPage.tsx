'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';

type GroupRequest = {
  id: number;
  requester: string;
  message: string;
  meta: string;
  actionLabel: string;
  gradientClassName: string;
};

type MyGroup = {
  id: string;
  name: string;
  memberCount: number;
  playlistCount: number;
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

const MOCK_GROUPS: MyGroup[] = [
  {
    id: '1',
    name: '인디밴드 러버스',
    memberCount: 32,
    playlistCount: 14,
    gradientClassName: 'from-[#6366f1] to-[#c084fc]',
  },
  {
    id: '2',
    name: '비 오는 날 감성 모임',
    memberCount: 12,
    playlistCount: 12,
    gradientClassName: 'from-[#38bdf8] to-[#4f46e5]',
  },
  {
    id: '3',
    name: '헤비로테 클럽',
    memberCount: 12,
    playlistCount: 12,
    gradientClassName: 'from-[#34d399] to-[#a3e635]',
  },
  {
    id: '4',
    name: '신스팝 러버스',
    memberCount: 12,
    playlistCount: 12,
    gradientClassName: 'from-[#d946ef] to-[#6366f1]',
  },
];

export default function GroupPage() {
  const router = useRouter();

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
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-6">
      {MOCK_REQUESTS.length > 0 && (
        <section className="flex flex-col gap-3">
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
        </section>
      )}

      <section className="flex gap-3">
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
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-text-primary text-xl font-bold">내 그룹</h2>
        <div className="flex flex-col gap-3">
          {MOCK_GROUPS.map((group) => (
            <Link
              key={group.id}
              href={`/group/${group.id}`}
              className="bg-bg-card hover:bg-input flex items-center gap-4 rounded-2xl p-3 transition-colors"
            >
              <div
                aria-hidden
                className={`size-14 shrink-0 rounded-xl bg-linear-to-br ${group.gradientClassName}`}
              />
              <div className="min-w-0">
                <h3 className="text-text-primary truncate text-base font-semibold">
                  {group.name}
                </h3>
                <p className="text-text-secondary mt-0.5 text-sm">
                  멤버 {group.memberCount}명 · 플레이리스트{' '}
                  {group.playlistCount}개
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
