'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

import TrackList from '@/app/playlist/_components/TrackList';
import type { CommentItemsType } from '@/app/playlist/detail/[id]/_components/CommentItemList';
import ComentItemList from '@/app/playlist/detail/[id]/_components/CommentItemList';
import PlaylistPlayer from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import { type PlaylistPlayerHandle } from '@/app/playlist/detail/[id]/_components/PlaylistPlayer';
import TrackHoverController from '@/app/playlist/detail/[id]/_components/TrackHoverController';
import Heart from '@/assets/icons/heart.svg';
import defaultImg from '@/assets/images/mook.jpg';
import Button from '@/components/Button';
import BackButton from '@/components/common/BackButton';
import KebabModal from '@/components/domain/KebabModal';
import { usePlayerStore } from '@/providers/player-store-provider';
import { type PlaylistTrack } from '@/services/playlist/playlist';

export default function PlaylistDetailView({
  tracks,
  comments,
}: {
  tracks: PlaylistTrack[];
  comments: CommentItemsType;
}) {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const stop = usePlayerStore((state) => state.stop);
  const playerRef = useRef<PlaylistPlayerHandle | null>(null);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const handleTrackClick = (track: PlaylistTrack) => {
    if (currentTrack?.videoId === track.videoId) {
      if (isPlaying) playerRef.current?.pause();
      else playerRef.current?.play();
      return;
    }
    playTrack(track);
  };

  const handleEnd = () => {
    const currentIndex = tracks.findIndex(
      (track) => track.videoId === currentTrack?.videoId,
    );
    const nextTrack = tracks[currentIndex + 1];
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

  return (
    <div className="flex max-w-7xl flex-col gap-10 p-2">
      <div
        className={`bg-bg-card fixed top-25 left-1/2 -translate-x-1/2 rounded-lg px-4 py-2 text-sm text-white transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'} `}
      >
        링크가 복사되었습니다.
      </div>
      <div className="flex justify-between">
        <BackButton />
        <KebabModal>
          <>
            {/* 아이디값 을 가져와서 분기처리 리스트 주인과 일반유저 */}
            <KebabModal.Item onClick={handleShare}>공유하기</KebabModal.Item>
            <KebabModal.Item
              onClick={() => {
                router.push(`/playlist/detail/${id}/edit`);
              }}
            >
              수정하기
            </KebabModal.Item>
          </>
        </KebabModal>
      </div>
      <div className="ju flex items-center gap-4">
        <Image
          src={defaultImg}
          width={145}
          height={145}
          alt="플레이리스트 이미지"
          className="rounded-xl"
        />
        <div className="mb-4 flex flex-col gap-3">
          <h3 className="text-text-primary text-xl font-bold">
            JPOP 플레이리스트
          </h3>
          <span className="text-text-secondary text-sm">작성자 : 아냐포져</span>
          <span>
            <Heart />
          </span>
        </div>
      </div>
      <p className="bg-bg-card text-text-primary rounded-xl p-4">
        공부할떄 들으면 집중 잘되는 노래들로 모아봤습니다. 비슷한 취향있으신
        분은좋아요 그룹생성 요청 눌러주세요,
      </p>
      <Button className="w-full"> 그룹생성 요청</Button>
      <div className="bg-bg-card rounded-xl p-4">
        <TrackList
          trackList={tracks}
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
    </div>
  );
}
