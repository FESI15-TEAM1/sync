import Button from '@/components/Button';
import type { GroupDetailResponse } from '@/services/group/group.types';

type GroupJoinBannerProps = {
  group: GroupDetailResponse;
  isLeader: boolean;
  isPending: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  onJoin: () => void;
};

// 비가입 유저: 참여 요청 버튼
export default function GroupJoinBanner({
  group,
  isLeader,
  isPending,
  isSuccess,
  errorMessage,
  onJoin,
}: GroupJoinBannerProps) {
  if (!group.isPublic || isLeader || group.isMember) return null;

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="primary"
        size="lg"
        isDisabled={isPending || isSuccess}
        onClick={onJoin}
        className="w-full rounded-full"
      >
        {isSuccess ? '참여 요청 완료' : '참여하기'}
      </Button>
      {errorMessage && (
        <p role="alert" className="text-sm text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
