'use client';

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import CopyIcon from '@/assets/icons/copy.svg';
import Star from '@/assets/icons/star.svg';
import Button from '@/components/Button';
import ConfirmModal from '@/components/ConfirmModal';
import KebabModal from '@/components/domain/KebabModal';
import PlaylistCard from '@/components/domain/PlaylistCard';
import { APIError } from '@/lib/http/error';
import { useUserStore } from '@/providers/user-store-provider';
import {
  editGroupPlaylists,
  getGroupMembers,
  getGroupPlaylists,
  highlightGroupPlaylist,
  leaveGroup,
  removeGroupPlaylist,
  requestJoinGroup,
} from '@/services/group/group.api';
import type {
  GetGroupPlaylistsResponse,
  GroupDetailResponse,
  GroupPlaylistResponse,
} from '@/services/group/group.types';
import { getUserPlaylists } from '@/services/playlist/playlist.api';
import type { MyPlaylistItem } from '@/services/playlist/playlistCard.type';

import GroupDetailTabs, { type DetailTab } from './GroupDetailTabs';
import GroupLeaveModal from './GroupLeaveModal';
import GroupMemberList from './GroupMemberList';
import PlaylistCardMenu from './PlaylistCardMenu';
import PlaylistEditModal, { type EditablePlaylist } from './PlaylistEditModal';

// 그룹 상세 화면에서 한 번에 다룰 플레이리스트 최대 개수(스펙상 페이지 최대치)
const PLAYLIST_QUERY_LIMIT = 50;
// 커서로 끝까지 모아 전체 목록을 확보하기 위한 최대 페이지 수
const MAX_PLAYLIST_PAGES = 10;
// 그룹 플레이리스트 무한 스크롤 한 페이지 개수
const PLAYLIST_PAGE_SIZE = 20;
// 바닥에 닿기 전에 미리 다음 페이지를 불러와 스크롤이 끊기지 않게 합니다.
const LOAD_MORE_ROOT_MARGIN = '200px';

export const groupPlaylistsQueryKey = (groupId: number) =>
  ['group', groupId, 'playlists'] as const;

async function fetchAllUserPlaylists(userId: number) {
  const items: MyPlaylistItem[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PLAYLIST_PAGES; page++) {
    const data = await getUserPlaylists(userId, {
      cursor,
      limit: PLAYLIST_QUERY_LIMIT,
    });

    items.push(...data.items);

    if (!data.nextCursor) break;
    cursor = data.nextCursor;
  }

  return items;
}

type GroupDetailProps = {
  groupId: number;
  group: GroupDetailResponse;
};

export type EditableGroupInfo = {
  name: string;
  description: string;
  isPublic: boolean;
  coverImage: string | null;
};

export default function GroupDetail({ groupId, group }: GroupDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useUserStore((state) => state.user);

  const isLeader = currentUser?.id === group.owner.userId;

  const [isEditPlaylistsOpen, setIsEditPlaylistsOpen] = useState(false);
  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>('playlists');

  const groupInfo: EditableGroupInfo = {
    name: group.title,
    description: group.description,
    isPublic: group.isPublic,
    coverImage: group.image,
  };
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  // 그룹 멤버 목록
  const groupMembersQuery = useQuery({
    queryKey: ['group', groupId, 'members'],
    queryFn: () => getGroupMembers(groupId, { limit: PLAYLIST_QUERY_LIMIT }),
  });

  // 그룹에 추가된 플레이리스트(커서 기반 무한 스크롤)
  const {
    data: groupPlaylistsData,
    isPending: isGroupPlaylistsPending,
    isError: isGroupPlaylistsError,
    fetchNextPage: fetchNextPlaylistsPage,
    hasNextPage: hasNextPlaylistsPage,
    isFetching: isFetchingPlaylists,
    isFetchingNextPage: isFetchingNextPlaylistsPage,
    isFetchNextPageError: isFetchNextPlaylistsPageError,
  } = useInfiniteQuery({
    queryKey: groupPlaylistsQueryKey(groupId),
    queryFn: ({ pageParam }) =>
      getGroupPlaylists(groupId, {
        cursor: pageParam,
        limit: PLAYLIST_PAGE_SIZE,
      }),
    initialPageParam: undefined as string | undefined,
    // nextCursor가 null이면 마지막 페이지입니다.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  // 목록 끝의 감지용 요소가 화면에 들어오면 다음 페이지를 이어서 불러옵니다.
  const playlistsLoadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = playlistsLoadMoreRef.current;
    // 다음 페이지 요청이 실패한 뒤에는 자동 재요청이 반복되지 않도록 재시도 버튼으로만 이어받습니다.
    if (
      !target ||
      !hasNextPlaylistsPage ||
      isFetchingPlaylists ||
      isFetchNextPlaylistsPageError
    )
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingPlaylists)
          fetchNextPlaylistsPage();
      },
      { rootMargin: LOAD_MORE_ROOT_MARGIN },
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, [
    hasNextPlaylistsPage,
    isFetchingPlaylists,
    isFetchNextPlaylistsPageError,
    fetchNextPlaylistsPage,
  ]);

  const handleRetryFetchPlaylists = () => {
    fetchNextPlaylistsPage();
  };

  const groupPlaylistItems: GroupPlaylistResponse[] =
    groupPlaylistsData?.pages.flatMap((page) => page.items) ?? [];

  const playlists: EditablePlaylist[] = groupPlaylistItems.map((item) => ({
    id: item.id,
    title: item.title,
    trackCount: item.trackCount,
    owner: item.owner.nickname,
    image: item.image,
    ownerId: item.owner.userId,
  }));

  // 내가 그룹에 추가할 수 있는 플레이리스트(내 플레이리스트 중 아직 추가되지 않은 것)
  const myPlaylistsQuery = useQuery({
    queryKey: ['user', currentUser?.id, 'playlists'],
    queryFn: () => fetchAllUserPlaylists(currentUser!.id),
    enabled: (isLeader || group.isMember) && currentUser !== null,
  });

  const addedPlaylistIds = new Set(playlists.map((item) => item.id));
  const availablePlaylists: EditablePlaylist[] = (myPlaylistsQuery.data ?? [])
    .filter((item) => !addedPlaylistIds.has(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title,
      trackCount: item.trackCount,
      owner: currentUser?.nickname ?? '',
      image: item.image,
      ownerId: currentUser?.id ?? 0,
    }));

  const isPlaylistsLoading =
    isGroupPlaylistsPending ||
    ((isLeader || group.isMember) && myPlaylistsQuery.isPending);

  // 하이라이트된 플레이리스트를 상단에 고정해서 보여준다
  const displayPlaylists = [...groupPlaylistItems].sort(
    (a, b) => Number(b.isHighlighted) - Number(a.isHighlighted),
  );
  //그룹 정보 수정
  const handleEditGroupInfo = () => {
    router.push(`/group/${groupId}/edit`);
  };
  const copyToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyErrorMessage, setCopyErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (copyToastTimerRef.current) clearTimeout(copyToastTimerRef.current);
    };
  }, []);
  //초대코드 복사
  const handleCopyInviteCode = async () => {
    if (!group.inviteCode) return;

    try {
      await navigator.clipboard.writeText(group.inviteCode);
      //복사 성공
      setCopyErrorMessage(null);
      setShowCopyToast(true);

      //기존 타이머 제거
      if (copyToastTimerRef.current) {
        clearTimeout(copyToastTimerRef.current);
      }
      //2초 후 토스트 숨기기
      copyToastTimerRef.current = setTimeout(() => {
        setShowCopyToast(false);
      }, 2000);
    } catch {
      //복사 실패
      setCopyErrorMessage('초대코드 복사에 실패했습니다. 직접 복사해주세요.');
      setShowCopyToast(false);
    }
  };
  //플레이리스트 편집
  const handleEditPlaylists = () => {
    if (isSavingPlaylists || isPlaylistsLoading) {
      console.log('click');
      return;
    }

    setSaveErrorMessage(null);
    setIsEditPlaylistsOpen(true);
  };

  //그룹 탈퇴
  const handleLeaveGroup = () => {
    setIsLeaveGroupOpen(true);
  };

  const { mutate: savePlaylists, isPending: isSavingPlaylists } = useMutation({
    mutationFn: (nextPlaylists: EditablePlaylist[]) =>
      editGroupPlaylists(groupId, {
        playlistIds: nextPlaylists.map((item) => item.id),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: groupPlaylistsQueryKey(groupId),
      });
      queryClient.invalidateQueries({
        queryKey: ['user', currentUser?.id, 'playlists'],
      });
      setIsEditPlaylistsOpen(false);
    },
    onError: (error) => {
      setSaveErrorMessage(
        error instanceof APIError
          ? error.message
          : '플레이리스트 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const handleSavePlaylists = (nextPlaylists: EditablePlaylist[]) => {
    savePlaylists(nextPlaylists);
  };

  // 그룹 플레이리스트 개별 제거(본인이 담은 것이거나 그룹장만 가능)
  const [removeTarget, setRemoveTarget] =
    useState<GroupPlaylistResponse | null>(null);
  const [removeErrorMessage, setRemoveErrorMessage] = useState<string | null>(
    null,
  );

  const { mutate: removePlaylist, isPending: isRemovingPlaylist } = useMutation(
    {
      mutationFn: (playlistId: number) =>
        removeGroupPlaylist(groupId, playlistId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: groupPlaylistsQueryKey(groupId),
        });
        router.refresh();
        setRemoveTarget(null);
      },
      onError: (error) => {
        setRemoveErrorMessage(
          error instanceof APIError
            ? error.message
            : '플레이리스트 제거 중 오류가 발생했습니다.',
        );
      },
    },
  );

  const handleRemovePlaylist = (playlist: GroupPlaylistResponse) => {
    if (isRemovingPlaylist) return;
    setRemoveErrorMessage(null);
    setRemoveTarget(playlist);
  };

  const handleConfirmRemovePlaylist = () => {
    if (!removeTarget) return;
    removePlaylist(removeTarget.id);
  };

  const handleCloseRemoveModal = () => {
    if (isRemovingPlaylist) return;
    setRemoveTarget(null);
    setRemoveErrorMessage(null);
  };

  // 그룹 플레이리스트 하이라이트(상단 고정, 그룹장만 가능) — 낙관적 업데이트
  const { mutate: toggleHighlight } = useMutation({
    mutationFn: ({
      playlistId,
      isHighlighted,
    }: {
      playlistId: number;
      isHighlighted: boolean;
    }) => highlightGroupPlaylist(groupId, playlistId, { isHighlighted }),
    onMutate: async ({ playlistId, isHighlighted }) => {
      await queryClient.cancelQueries({
        queryKey: groupPlaylistsQueryKey(groupId),
      });

      const previousPlaylists = queryClient.getQueryData<
        InfiniteData<GetGroupPlaylistsResponse>
      >(groupPlaylistsQueryKey(groupId));

      queryClient.setQueryData<InfiniteData<GetGroupPlaylistsResponse>>(
        groupPlaylistsQueryKey(groupId),
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === playlistId ? { ...item, isHighlighted } : item,
              ),
            })),
          },
      );

      return { previousPlaylists };
    },
    onError: (error, _variables, context) => {
      if (context?.previousPlaylists) {
        queryClient.setQueryData(
          groupPlaylistsQueryKey(groupId),
          context.previousPlaylists,
        );
      }

      alert(
        error instanceof APIError
          ? error.message
          : '하이라이트 설정 중 오류가 발생했습니다.',
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: groupPlaylistsQueryKey(groupId),
      });
    },
  });

  const handleToggleHighlight = (playlist: GroupPlaylistResponse) => {
    toggleHighlight({
      playlistId: playlist.id,
      isHighlighted: !playlist.isHighlighted,
    });
  };

  const leaveGroupMutation = useMutation({
    mutationFn: () => {
      if (!currentUser) throw new Error('로그인이 필요합니다.');
      return leaveGroup(groupId, currentUser.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setIsLeaveGroupOpen(false);
      router.push('/group');
    },
    onError: (error) => {
      if (error instanceof APIError) {
        console.error(error.message);
        alert(error.message);
        return;
      }

      console.error(error);
      alert('그룹 탈퇴 중 오류가 발생했습니다.');
    },
  });

  const handleConfirmLeave = () => {
    if (!currentUser) return;
    leaveGroupMutation.mutate();
  };

  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);

  const joinGroupMutation = useMutation({
    mutationFn: () => requestJoinGroup(groupId),
    onSuccess: () => {
      setJoinErrorMessage(null);
    },
    onError: (error) => {
      setJoinErrorMessage(
        error instanceof APIError
          ? error.message
          : '참여 요청에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    },
  });

  const handleJoinGroup = () => {
    if (joinGroupMutation.isPending) return;
    joinGroupMutation.mutate();
  };

  return (
    <>
      <div
        role="status"
        aria-live="polite"
        aria-hidden={!showCopyToast}
        className={`bg-bg-card fixed top-25 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white transition-all duration-300 ${showCopyToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'} `}
      >
        {showCopyToast ? '초대코드가 복사되었습니다.' : ''}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 py-6">
        <div className="flex items-start gap-4">
          {groupInfo.coverImage ? (
            <Image
              src={groupInfo.coverImage}
              alt={groupInfo.name}
              width={80}
              height={80}
              className="size-20 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div
              className="bg-input size-20 shrink-0 rounded-2xl"
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-text-primary text-xl font-bold">
                {groupInfo.name}
              </h1>
              {/* 케밥 메뉴: 가입한 그룹(멤버/그룹장)일 때만 노출 */}
              {(isLeader || group.isMember) && (
                <KebabModal>
                  {isLeader ? (
                    <>
                      <KebabModal.Item onClick={handleEditGroupInfo}>
                        그룹 정보 수정
                      </KebabModal.Item>
                      <KebabModal.Item onClick={handleEditPlaylists}>
                        플레이리스트 편집
                      </KebabModal.Item>
                    </>
                  ) : (
                    <>
                      <KebabModal.Item onClick={handleEditPlaylists}>
                        내 플레이리스트 편집
                      </KebabModal.Item>
                      <KebabModal.Item
                        variant="danger"
                        onClick={handleLeaveGroup}
                      >
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
                    onClick={handleCopyInviteCode}
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

        {/* 비가입 유저: 참여 요청 버튼 */}
        {group.isPublic && !isLeader && !group.isMember && (
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="primary"
              size="lg"
              isDisabled={
                joinGroupMutation.isPending || joinGroupMutation.isSuccess
              }
              onClick={handleJoinGroup}
              className="w-full rounded-full"
            >
              {joinGroupMutation.isSuccess ? '참여 요청 완료' : '참여하기'}
            </Button>
            {joinErrorMessage && (
              <p role="alert" className="text-sm text-red-500">
                {joinErrorMessage}
              </p>
            )}
          </div>
        )}

        {saveErrorMessage && (
          <p role="alert" className="text-sm text-red-500">
            {saveErrorMessage}
          </p>
        )}

        {/* 플레이리스트 편집 모달 */}
        {isEditPlaylistsOpen && (
          <PlaylistEditModal
            isOpen={isEditPlaylistsOpen}
            addedPlaylists={playlists}
            availablePlaylists={availablePlaylists}
            isLeader={isLeader}
            currentUserId={currentUser?.id ?? null}
            onClose={() => setIsEditPlaylistsOpen(false)}
            onSave={handleSavePlaylists}
          />
        )}

        {/* 그룹 탈퇴 모달 */}
        <GroupLeaveModal
          isOpen={isLeaveGroupOpen}
          groupName={groupInfo.name}
          onClose={() => setIsLeaveGroupOpen(false)}
          onConfirm={handleConfirmLeave}
        />

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
      </div>
      <GroupDetailTabs activeTab={activeTab} onChange={setActiveTab} />
      <div className="mx-auto mt-4 w-full max-w-md px-5">
        {activeTab === 'playlists' ? (
          isGroupPlaylistsPending ? (
            <p className="text-text-secondary text-sm">
              플레이리스트를 불러오는 중입니다...
            </p>
          ) : isGroupPlaylistsError ? (
            <p role="alert" className="text-sm text-red-500">
              플레이리스트를 불러오는데 실패했습니다.
            </p>
          ) : (
            <>
              <div className="flex flex-row flex-wrap gap-3">
                {displayPlaylists.map((playlist) => {
                  const canRemove =
                    isLeader || playlist.owner.userId === currentUser?.id;

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

                      {canRemove && (
                        <div className="absolute right-5 bottom-5 z-10">
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
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {hasNextPlaylistsPage && (
                <div
                  ref={playlistsLoadMoreRef}
                  className="flex flex-col items-center justify-center gap-2 py-4"
                >
                  {isFetchingNextPlaylistsPage && (
                    <p className="text-text-secondary text-sm">
                      플레이리스트를 더 불러오는 중입니다...
                    </p>
                  )}

                  {isFetchNextPlaylistsPageError && (
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
            </>
          )
        ) : (
          <GroupMemberList
            groupId={groupId}
            isLeader={isLeader}
            members={groupMembersQuery.data?.items ?? []}
            isLoading={groupMembersQuery.isPending}
            isError={groupMembersQuery.isError}
          />
        )}
      </div>
    </>
  );
}
