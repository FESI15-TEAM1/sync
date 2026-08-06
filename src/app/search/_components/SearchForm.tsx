'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import SearchBar from '@/components/domain/layout/SearchBar';
import PlaylistCard from '@/components/domain/PlaylistCard';
import PlayroomList from '@/components/domain/playroom/PlayroomList';
import { type PlayroomCardData } from '@/services/playroom/playroom.types';

export default function SearchForm({ data }: { data: PlayroomCardData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
    <div className="flex w-full flex-col gap-8 p-4">
      <SearchBar />
      <span className="text-text-primary w-full font-bold">PlayList</span>
      {/* 컨테이너 */}
      <div ref={containerRef} className="w-full">
        <motion.div
          ref={contentRef}
          drag={dragRange > 0 ? 'x' : false}
          dragConstraints={{ left: -dragRange, right: 0 }}
          dragElastic={0.1}
          className={`flex w-full gap-4 select-none ${dragRange > 0 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>{' '}
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>{' '}
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>{' '}
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>{' '}
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>{' '}
          <div className="shrink-0">
            <PlaylistCard title={'아냐포져가 만든곡 '} trackCount={15} />
          </div>
        </motion.div>
      </div>
      <span className="text-text-primary font-bold">Live</span>
      <div>
        <PlayroomList data={data} />
      </div>
    </div>
  );
}
