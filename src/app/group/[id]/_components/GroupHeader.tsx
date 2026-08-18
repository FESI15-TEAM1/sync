import Image from 'next/image';

import CopyIcon from '@/assets/icons/copy.svg';
import KebabModal from '@/components/domain/KebabModal';
import type { GroupDetailResponse } from '@/services/group/group.types';

type GroupHeaderProps = {
  group: GroupDetailResponse;
  isLeader: boolean;
  copyErrorMessage: string | null;
  onEditGroupInfo: () => void;
  onEditPlaylists: () => void;
  onLeaveGroup: () => void;
  onCopyInviteCode: () => void;
};

export default function GroupHeader({
  group,
  isLeader,
  copyErrorMessage,
  onEditGroupInfo,
  onEditPlaylists,
  onLeaveGroup,
  onCopyInviteCode,
}: GroupHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      {group.image ? (
        <Image
          src={group.image}
          alt={group.title}
          width={80}
          height={80}
          className="size-20 shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <div className="bg-input size-20 shrink-0 rounded-2xl" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-text-primary text-xl font-bold">
            {group.title}
          </h1>
          {/* 케밥 메뉴: 가입한 그룹(멤버/그룹장)일 때만 노출 */}
          {(isLeader || group.isMember) && (
            <KebabModal>
              {isLeader ? (
                <>
                  <KebabModal.Item onClick={onEditGroupInfo}>
                    그룹 정보 수정
                  </KebabModal.Item>
                  <KebabModal.Item onClick={onEditPlaylists}>
                    플레이리스트 편집
                  </KebabModal.Item>
                </>
              ) : (
                <>
                  <KebabModal.Item onClick={onEditPlaylists}>
                    내 플레이리스트 편집
                  </KebabModal.Item>
                  <KebabModal.Item variant="danger" onClick={onLeaveGroup}>
                    그룹 탈퇴하기
                  </KebabModal.Item>
                </>
              )}
            </KebabModal>
          )}
        </div>
        <p className="text-text-secondary mt-1 text-sm">
          멤버 {group.memberCount}명 · 플레이리스트 {group.playlistCount}개
        </p>
        {group.inviteCode && (
          <>
            <div className="mt-0.5 flex items-center gap-1">
              <p className="text-text-secondary text-sm">
                초대코드 {group.inviteCode}
              </p>
              <button
                type="button"
                aria-label="초대코드 복사"
                onClick={onCopyInviteCode}
                className="text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <CopyIcon width={15} height={15} />
              </button>
            </div>
            {copyErrorMessage && (
              <p role="alert" className="text-sm text-red-500">
                {copyErrorMessage}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
