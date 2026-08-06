'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import ComentItemList from '@/app/playlist/detail/[id]/_components/CommentItemList';
import PlaylistPlayer from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import { type PlaylistPlayerHandle } from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import TrackHoverController from '@/app/playlist/detail/[id]/_components/TrackHoverController';
import Heart from '@/assets/icons/heart.svg';
import defaultImg from '@/assets/images/default.png';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import KebabModal from '@/components/domain/KebabModal';
import TrackList from '@/components/domain/playlists/TrackList';
import Modal from '@/components/Modal';
import { clientFetch } from '@/lib/http/client-fetch';
import { APIError } from '@/lib/http/error';
import { usePlayerStore } from '@/providers/player-store-provider';
import type { PlaylistDetail } from '@/services/playlist/PlatylistDetail.type';
import { type PlaylistTrack } from '@/services/playlist/playlist';
import { deletePlaylist } from '@/services/playlist/playlist.api';

export default function PlaylistDetailView({
  userid,
}: {
  userid: number | null;
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const stop = usePlayerStore((state) => state.stop);
  const playerRef = useRef<PlaylistPlayerHandle | null>(null);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const id = params.id;

  console.log('id: ', id);
  const {
    data: playlist,
    isPending: isPlaylistPending,
    error: playlistError,
  } = useQuery({
    queryKey: ['playlists', id],
    queryFn: () => clientFetch<PlaylistDetail>(`/playlists/${id}`),
  });
  const {
    data: comments,
    isPending: isCommentsPending,
    error: commentsError,
  } = useQuery({
    queryKey: ['playlists', id, 'comments'],
    queryFn: () => clientFetch<CommentItemsType>(`/playlists/${id}/comments`),
  });
  if (isCommentsPending || isPlaylistPending)
    return <div className="text-text-primary font-bold">로딩중...</div>;
  if (commentsError || playlistError) return <div>에러남</div>;

  const handleTrackClick = (track: PlaylistTrack) => {
    if (currentTrack?.videoId === track.videoId) {
      if (isPlaying) playerRef.current?.pause();
      else playerRef.current?.play();
      return;
    }
    playTrack(track);
  };

  const handleEnd = () => {
    const currentIndex = playlist.tracks.findIndex(
      (track) => track.videoId === currentTrack?.videoId,
    );
    const nextTrack = playlist.tracks[currentIndex + 1];
    if (nextTrack) playTrack(nextTrack);
    else stop();
  };
  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleDelete = async () => {
    try {
      await deletePlaylist(Number(id));
      setIsOpen(false);
      router.push('/playlist');
    } catch (error) {
      if (error instanceof APIError) {
        setIsOpen(true);
        setErrorMessage(error.message);
      }
    }
  };
  return (
    <div className="flex max-w-3xl flex-col gap-10 p-2 lg:min-w-3xl">
      <div
        className={`bg-bg-card fixed top-25 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'} `}
      >
        링크가 복사되었습니다.
      </div>
      <div className="flex justify-between">
        <BackButton />
        <KebabModal>
          <>
            {userid == playlist.owner.userId ? (
              <>
                <KebabModal.Item onClick={handleShare}>
                  공유하기
                </KebabModal.Item>
                <KebabModal.Item
                  onClick={() => {
                    router.push(`/playlist/detail/${id}/edit`);
                  }}
                >
                  수정하기
                </KebabModal.Item>
                <KebabModal.Item
                  onClick={() => setIsOpen(!isOpen)}
                  variant={'danger'}
                >
                  삭제하기
                </KebabModal.Item>
              </>
            ) : (
              <>
                <KebabModal.Item onClick={handleShare}>
                  공유하기
                </KebabModal.Item>
              </>
            )}
          </>
        </KebabModal>
      </div>
      <div className="ju flex items-center gap-4">
        <Image
          src={playlist.image || defaultImg}
          width={145}
          height={145}
          alt="플레이리스트 이미지"
          className="rounded-xl"
        />
        <div className="mb-4 flex flex-col gap-3">
          <h3 className="text-text-primary text-xl font-bold">
            {playlist.title}
          </h3>
          <span className="text-text-secondary text-sm">{`작성자: ${playlist.owner.nickname}`}</span>
          <span>
            <Heart />
          </span>
        </div>
      </div>
      <p className="bg-bg-card text-text-primary rounded-xl p-4">
        {playlist.description}
      </p>
      <Button className="w-full"> 그룹생성 요청</Button>
      <div className="bg-bg-card rounded-xl p-4">
        <TrackList
          trackList={playlist?.tracks}
          onTrackClick={handleTrackClick}
          Button={(track) => (
            <TrackHoverController
              isPlaying={track.videoId === currentTrack?.videoId && isPlaying}
              onToggle={() => handleTrackClick(track)}
            />
          )}
        />
      </div>
      {currentTrack && (
        <PlaylistPlayer
          ref={playerRef}
          videoId={currentTrack.videoId}
          onEnded={handleEnd}
        />
      )}
      <div>
        <h4 className="text-text-primary mb-2 text-xl font-bold">댓글</h4>
        <ComentItemList comments={comments} />
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="p-5">
          <Modal.Body>
            <h2
              id="login-required-modal-title"
              className="text-text-primary text-center text-lg font-bold"
            >
              {errorMessage ? errorMessage : '정말로 삭제하시겠습니까?'}
            </h2>
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="button"
              size="md"
              variant="outline"
              className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              size="md"
              variant="primary"
              className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
              onClick={handleDelete}
            >
              삭제
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}
