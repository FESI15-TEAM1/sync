'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import PlaylistCard from '@/components/domain/PlaylistCard';
import type { SearchPlaylistItem } from '@/services/search/search.types';

export default function SearchPlaylistCarousel({
  items,
}: {
  items: SearchPlaylistItem[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [dragRange, setDragRange] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const updateDragRange = () => {
      setDragRange(Math.max(0, content.scrollWidth - container.clientWidth));
    };

    updateDragRange();

    const resizeObserver = new ResizeObserver(updateDragRange);
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <motion.div
        ref={contentRef}
        drag={dragRange > 0 ? 'x' : false}
        dragConstraints={{ left: -dragRange, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          // click은 mouseup 뒤에 동기적으로 발생하므로, 다음 태스크로 미뤄야 그 click을 막을 수 있습니다.
          setTimeout(() => {
            isDraggingRef.current = false;
          }, 0);
        }}
        onClickCapture={(e) => {
          if (isDraggingRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`flex w-full gap-4 select-none ${dragRange > 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
      >
        {items.map((item) => (
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
