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
  return (
    <div className="flex flex-row items-center justify-center gap-4">
      <IconButton
        size="md"
        variants="secondary"
        disabled={!isHost}
        onClick={playPreviousTrack}
        className="bg-border text-gray-400 hover:text-gray-100"
      >
        <BackwardIcon width={20} height={20} />
      </IconButton>
      <IconButton
        size="lg"
        variants="primary"
        disabled={!isHost}
        onClick={playPause}
        className="shadow-primary transition-all duration-300 ease-in hover:shadow-[0_0_10px_bg-bg-primary]"
      >
        {isPlaying ? (
          <PauseIcon width={24} height={24} color="white" />
        ) : (
          <PlayIcon width={24} height={24} color="white" />
        )}
      </IconButton>
      <IconButton
        size="md"
        variants="secondary"
        disabled={!isHost}
        onClick={playNextTrack}
        className="bg-border text-gray-400 hover:text-gray-100"
      >
        <ForwardIcon width={20} height={20} />
      </IconButton>
    </div>
  );
}
