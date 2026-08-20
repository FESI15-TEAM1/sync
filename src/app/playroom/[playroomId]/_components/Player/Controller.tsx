import { cva } from 'class-variance-authority';

import BackwardIcon from '@/assets/icons/controller/backward-solid.svg';
import ForwardIcon from '@/assets/icons/controller/forward-solid.svg';
import PauseIcon from '@/assets/icons/controller/pause-solid.svg';
import PlayIcon from '@/assets/icons/controller/play-solid.svg';
import IconButton from '@/components/IconButton';

export default function Controller({
  playPreviousTrack,
  playNextTrack,
  playPause,
  isPlaying,
  isHost,
}: {
  playPreviousTrack: () => void;
  playNextTrack: () => void;
  playPause: () => void;
  isPlaying: boolean;
  isHost: boolean;
}) {
  const prevNextButtonStyles = cva('bg-border', {
    variants: {
      isHost: {
        true: 'bg-border text-gray-400 hover:text-gray-100',
        false: 'bg-disabled text-text-secondary cursor-not-allowed',
      },
    },
  });

  const playPauseButtonStyles = cva('', {
    variants: {
      isHost: {
        true: 'shadow-primary transition-all duration-300 ease-in hover:shadow-[0_0_10px_bg-bg-primary]',
        false: 'bg-disabled text-bg-primary cursor-not-allowed',
      },
    },
  });

  const playPauseIconStyles = cva('', {
    variants: {
      isHost: {
        true: 'text-white',
        false: 'text-text-secondary',
      },
    },
  });

  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <IconButton
        size="md"
        variants="secondary"
        disabled={!isHost}
        onClick={playPreviousTrack}
        className={prevNextButtonStyles({ isHost })}
      >
        <BackwardIcon width={20} height={20} />
      </IconButton>
      <IconButton
        size="lg"
        variants="primary"
        disabled={!isHost}
        onClick={playPause}
        className={playPauseButtonStyles({ isHost })}
      >
        {isPlaying ? (
          <PauseIcon
            width={24}
            height={24}
            className={playPauseIconStyles({ isHost })}
          />
        ) : (
          <PlayIcon
            width={24}
            height={24}
            className={playPauseIconStyles({ isHost })}
          />
        )}
      </IconButton>
      <IconButton
        size="md"
        variants="secondary"
        disabled={!isHost}
        onClick={playNextTrack}
        className={prevNextButtonStyles({ isHost })}
      >
        <ForwardIcon width={20} height={20} />
      </IconButton>
    </div>
  );
}
