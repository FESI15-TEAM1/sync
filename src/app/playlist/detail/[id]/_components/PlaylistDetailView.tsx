'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import ComentItemList from '@/app/playlist/detail/[id]/_components/CommentItemList';
import PlaylistPlayer from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import { type PlaylistPlayerHandle } from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import PlaylistPlayerBar from '@/app/playlist/detail/[id]/_components/PlaylistPlayerBar';
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

const RESTART_THRESHOLD_SECONDS = 3;

export default function PlaylistDetailView({
  userid,
}: {
  userid: number | null;
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const stop = usePlayerStore((state) => state.stop);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const playerRef = useRef<PlaylistPlayerHandle | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
  const [trackIdForTime, setTrackIdForTime] = useState(currentTrack?.videoId);
  if (currentTrack?.videoId !== trackIdForTime) {
    setTrackIdForTime(currentTrack?.videoId);
    setCurrentTime(0);
    setDuration(0);
  }

  const [lastTrack, setLastTrack] = useState(currentTrack);
  if (currentTrack && currentTrack !== lastTrack) {
    setLastTrack(currentTrack);
  }

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(playerRef.current?.getCurrentTime() ?? 0);
      setDuration(playerRef.current?.getDuration() ?? 0);
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    return () => setIsPlaying(false);
  }, [setIsPlaying]);

  if (isCommentsPending || isPlaylistPending)
    return <div className="text-text-primary font-bold">로딩중...</div>;
  if (commentsError || playlistError) return <div>에러남</div>;

  const handleTogglePlay = () => {
    if (isPlaying) playerRef.current?.pause();
    else playerRef.current?.play();
  };

  const handleTrackClick = (track: PlaylistTrack) => {
    if (currentTrack?.videoId === track.videoId) {
      handleTogglePlay();
      return;
    }
    playerRef.current?.loadVideo(track.videoId);
    playTrack(track);
  };

  const handleEnd = () => {
    const currentIndex = playlist.tracks.findIndex(
      (track) => track.videoId === currentTrack?.videoId,
    );
    const nextTrack = playlist.tracks[currentIndex + 1];
    if (nextTrack) {
      playerRef.current?.loadVideo(nextTrack.videoId);
      playTrack(nextTrack);
    } else {
      stop();
    }
  };

  const handlePrevious = () => {
    const elapsed = playerRef.current?.getCurrentTime() ?? 0;
    if (elapsed > RESTART_THRESHOLD_SECONDS) {
      playerRef.current?.seekTo(0);
      setCurrentTime(0);
      return;
    }
    const currentIndex = playlist.tracks.findIndex(
      (track) => track.videoId === currentTrack?.videoId,
    );
    const prevTrack = playlist.tracks[currentIndex - 1];
    if (prevTrack) {
      playerRef.current?.loadVideo(prevTrack.videoId);
      playTrack(prevTrack);
    } else {
      playerRef.current?.seekTo(0);
      setCurrentTime(0);
    }
  };

  const handleSeek = (time: number) => {
    playerRef.current?.seekTo(time);
    setCurrentTime(time);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleOpenDeleteModal = () => {
    setErrorMessage('');
    setIsOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setErrorMessage('');
    setIsOpen(false);
  };
  const handleDelete = async () => {
    try {
      await deletePlaylist(Number(id));
      handleCloseDeleteModal();
      router.push('/playlist');
    } catch (error) {
      setErrorMessage(
        error instanceof APIError
          ? error.message
          : '플레이리스트를 삭제하는 중 오류가 발생했습니다.',
      );
    }
  };
  return (
    <div
      className={`flex max-w-7xl flex-col gap-10 p-2 ${currentTrack ? 'pb-24' : ''}`}
    >
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
                  onClick={handleOpenDeleteModal}
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
          autoPlay={isPlaying}
          onEnded={handleEnd}
        />
      )}
      {lastTrack && (
        <PlaylistPlayerBar
          track={lastTrack}
          isVisible={!!currentTrack}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          onTogglePlay={handleTogglePlay}
          onPrevious={handlePrevious}
          onNext={handleEnd}
          onStop={stop}
          onSeek={handleSeek}
        />
      )}
      <div>
        <h4 className="text-text-primary mb-2 text-xl font-bold">댓글</h4>
        <ComentItemList comments={comments} />
      </div>
      <Modal isOpen={isOpen} onClose={handleCloseDeleteModal}>
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
              onClick={handleCloseDeleteModal}
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
