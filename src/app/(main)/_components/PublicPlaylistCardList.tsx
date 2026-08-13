'use client';

import { animate, motion, type PanInfo, useMotionValue } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import PlaylistCard from '@/components/domain/PlaylistCard';

import { useGetPublicPlaylists } from '../_hooks/useMainQueries';

export default function PublicPlaylistCardList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [dragRange, setDragRange] = useState(0);
  const [step, setStep] = useState(0);
  const x = useMotionValue(0);

  const { data, isPending, error } = useGetPublicPlaylists();

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
  }, [data, isPending]);
  if (isPending)
    return (
      <div>
        <PublicPlaylistSkeleton />
      </div>
    );
  if (error) return <div>에러발생 초비상</div>;

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
          if (isDraggingRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`flex w-full gap-4 select-none ${dragRange > 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {data.items.map((item) => (
          <Link
            className="shrink-0"
            key={item.id}
            href={`/playlist/detail/${item.id}`}
            draggable={false}
          >
            <PlaylistCard title={item.title} img={item.image} />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}

export function PublicPlaylistSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex w-full gap-4 overflow-hidden select-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{ animationDelay: `${i * 100}ms` }}
          className="flex h-57.5 w-42.5 shrink-0 animate-pulse flex-col gap-2 rounded-2xl px-3 py-5"
        >
          <div className="bg-border aspect-square rounded-2xl" />
          <div className="flex flex-col gap-1.5">
            <div className="bg-border h-4 w-3/4 rounded" />
            <div className="bg-border h-3 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
