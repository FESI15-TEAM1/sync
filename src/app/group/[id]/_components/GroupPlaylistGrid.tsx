'use client';

import Link from 'next/link';

import Star from '@/assets/icons/star.svg';
import Button from '@/components/Button';
import ConfirmModal from '@/components/ConfirmModal';
import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';

import { useGroupPlaylists } from '../_hooks/useGroupPlaylists';
import { useRemoveGroupPlaylist } from '../_hooks/useRemoveGroupPlaylist';
import { useToggleHighlightPlaylist } from '../_hooks/useToggleHighlightPlaylist';
import PlaylistCardMenu from './PlaylistCardMenu';

type GroupPlaylistGridProps = {
  groupId: number;
  isLeader: boolean;
  currentUserId: number | null;
};

export default function GroupPlaylistGrid({
  groupId,
  isLeader,
  currentUserId,
}: GroupPlaylistGridProps) {
  const {
    displayPlaylists,
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    loadMoreRef,
    handleRetryFetchPlaylists,
  } = useGroupPlaylists(groupId);

  const { handleToggleHighlight } = useToggleHighlightPlaylist(groupId);

  const {
    removeTarget,
    removeErrorMessage,
    isRemovingPlaylist,
    handleRemovePlaylist,
    handleConfirmRemovePlaylist,
    handleCloseRemoveModal,
  } = useRemoveGroupPlaylist(groupId);

  if (isPending) {
    return (
      <p className="text-text-secondary text-sm">
        플레이리스트를 불러오는 중입니다...
      </p>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-red-500">
        플레이리스트를 불러오는데 실패했습니다.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(2,max-content)] items-center justify-center gap-4 sm:flex sm:flex-wrap sm:justify-start">
        {displayPlaylists.map((playlist) => {
          const canRemove = isLeader || playlist.owner.userId === currentUserId;

          return (
            <div
              key={playlist.id}
              className={`group relative rounded-2xl ${
                playlist.isHighlighted ? 'bg-primary/10' : ''
              }`}
            >
              <Link href={`/playlist/detail/${playlist.id}`}>
                <PlaylistCard
                  img={playlist.image}
                  title={playlist.title}
                  trackCount={playlist.trackCount}
                  buttonChild={
                    canRemove && (
                      <PlaylistCardMenu>
                        {isLeader && (
                          <KebabModal.Item
                            onClick={() => handleToggleHighlight(playlist)}
                          >
                            {playlist.isHighlighted
                              ? '하이라이트 해제'
                              : '하이라이트'}
                          </KebabModal.Item>
                        )}
                        {canRemove && (
                          <KebabModal.Item
                            variant="danger"
                            onClick={() => handleRemovePlaylist(playlist)}
                          >
                            플레이리스트 제거
                          </KebabModal.Item>
                        )}
                      </PlaylistCardMenu>
                    )
                  }
                />
              </Link>

              {playlist.isHighlighted && (
                <div
                  className="bg-primary pointer-events-none absolute -top-2 -left-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-white drop-shadow-sm"
                  aria-label="하이라이트됨"
                >
                  <Star width={15} height={15} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="flex flex-col items-center justify-center gap-2 py-4"
        >
          {isFetchingNextPage && (
            <p className="text-text-secondary text-sm">
              플레이리스트를 더 불러오는 중입니다...
            </p>
          )}

          {isFetchNextPageError && (
            <>
              <p role="alert" className="text-sm text-red-500">
                플레이리스트를 더 불러오는데 실패했습니다.
              </p>
              <Button
                size="sm"
                variant="outline"
                isDisabled={false}
                type="button"
                onClick={handleRetryFetchPlaylists}
              >
                다시 시도
              </Button>
            </>
          )}
        </div>
      )}

      {/* 플레이리스트 제거 확인 모달 */}
      <ConfirmModal
        isOpen={removeTarget !== null}
        title={`'${removeTarget?.title}'을(를) 그룹에서 제거하시겠습니까?`}
        confirmLabel="제거하기"
        confirmingLabel="제거하는 중..."
        isConfirming={isRemovingPlaylist}
        errorMessage={removeErrorMessage}
        destructive
        onConfirm={handleConfirmRemovePlaylist}
        onClose={handleCloseRemoveModal}
      />
    </>
  );
}
