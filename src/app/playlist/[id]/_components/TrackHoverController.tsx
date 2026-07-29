'use client';

import PauseIcon from '@/assets/icons/pause.svg';
import PlayIcon from '@/assets/icons/play.svg';
import IconButton from '@/components/IconButton';

export default function TrackHoverController({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <IconButton
      size="sm"
      className="text-text-primary opacity-0 transition-opacity group-hover:opacity-100" // 같은 그룹 요소가 hover되었을때 도 반응 기점은 group으로 track에다가
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </IconButton>
  );
}
