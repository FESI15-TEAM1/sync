'use client';

import { animate, motion, type PanInfo, useMotionValue } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { PublicPlaylistSkeleton } from '@/app/(main)/_components/PublicPlaylistCardList';
import PlaylistCard from '@/components/domain/PlaylistCard';

import { useGetMyPlaylists } from '../_hooks/useGetMyPlaylists';

type PlaylistSelectorProps = {
  selectedPlaylistId: number | null;
  onSelect: (playlistId: number) => void;
};

export default function PlaylistSelector({
  selectedPlaylistId,
  onSelect,
}: PlaylistSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [dragRange, setDragRange] = useState(0);
  const [step, setStep] = useState(0);
  const x = useMotionValue(0);

  const { playlists, isLoading, isError } = useGetMyPlaylists();

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const updateDragRange = () => {
      setDragRange(Math.max(0, content.scrollWidth - container.clientWidth));

      const firstCard = content.firstElementChild as HTMLElement | null;
      if (firstCard) {
        const gap = parseFloat(getComputedStyle(content).columnGap || '0');
        setStep(firstCard.offsetWidth + gap);
      }
    };

    updateDragRange();

    const resizeObserver = new ResizeObserver(updateDragRange);
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [playlists]);

  if (isLoading) return <PublicPlaylistSkeleton />;

  if (isError)
    return (
      <p role="alert" className="text-sm text-red-500">
        플레이리스트를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </p>
    );

  if (!playlists || playlists.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        공유할 수 있는 플레이리스트가 없습니다. 플레이리스트를 만들어보세요!{' '}
        <Link
          href="/playlist/add"
          className="text-primary hover:text-secondary font-bold hover:underline"
        >
          플레이리스트 만들기
        </Link>
      </p>
    );
  }

  // 카드 하나 너비(step) 단위로 가장 가까운 인덱스에 스프링 애니메이션으로 스냅합니다.
  const handleDragEnd = (
    _event: PointerEvent | MouseEvent | TouchEvent,
    info: PanInfo,
  ) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 0);

    if (step === 0) {
      animate(x, Math.min(Math.max(x.get(), -dragRange), 0), {
        type: 'spring',
        stiffness: 100,
        damping: 30,
      });
      return;
    }

    const projected = x.get() + info.velocity.x * 0.2;
    const maxIndex = Math.round(dragRange / step);
    const targetIndex = Math.min(
      Math.max(Math.round(-projected / step), 0),
      maxIndex,
    );
    const target = Math.max(-targetIndex * step, -dragRange);

    animate(x, target, {
      type: 'spring',
      stiffness: 100,
      damping: 30,
    });
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-clip overflow-y-visible"
    >
      <motion.div
        ref={contentRef}
        style={{ x }}
        drag={dragRange > 0 ? 'x' : false}
        dragConstraints={{ left: -dragRange, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        onClickCapture={(e) => {
          // 드래그로 끝난 제스처가 카드 선택으로 이어지지 않게 막습니다.
          if (isDraggingRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`flex w-full gap-4 select-none ${dragRange > 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {playlists.map((playlist) => {
          const isSelected = playlist.id === selectedPlaylistId;

          return (
            <button
              key={playlist.id}
              type="button"
              onClick={() => onSelect(playlist.id)}
              aria-pressed={isSelected}
              className="relative shrink-0 cursor-pointer rounded-2xl text-left"
            >
              <PlaylistCard
                img={playlist.image}
                title={playlist.title}
                trackCount={playlist.trackCount}
              />
              {isSelected ? (
                // 선택 여부는 aria-pressed 로 전달되므로 오버레이 문구는 중복 낭독을 막는다.
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 font-bold text-white"
                >
                  선택됨
                </span>
              ) : null}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
