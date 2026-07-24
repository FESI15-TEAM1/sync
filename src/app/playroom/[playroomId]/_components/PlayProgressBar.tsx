import clsx from 'clsx';

export default function PlayProgressBar({
  currentTime,
  durations,
}: {
  currentTime: number;
  durations: string;
}) {
  const formatDuration = (t: string) => {
    const regex = /PT(\d+)M(\d+)S/;
    const match = t.match(regex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    return '0:00';
  };

  const formatCurrentTime = (t: number) => {
    const minutes = Math.floor(t / 60);
    const seconds = Math.floor(t % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (ct: string, d: string) => {
    const toSeconds = (time: string) => {
      return time.split(':').reduce((pre, cur) => pre * 60 + Number(cur), 0);
    };

    const currentTimeInSeconds = toSeconds(ct);
    const durationInSeconds = toSeconds(d);

    const percentage = (
      (currentTimeInSeconds / durationInSeconds) *
      100
    ).toFixed(0);

    console.log(percentage);

    return percentage;
  };

  const progressBarWidth = clsx(
    `w-[${progressPercentage(
      formatCurrentTime(currentTime),
      formatDuration(durations),
    )}%]`,
  );

  return (
    <div className="mt-3 w-full max-w-[60%]">
      <div className="bg-bg-primary h-1 w-full rounded-full">
        <div
          className={`bg-primary h-1 rounded-full transition-all duration-300 ${progressBarWidth}`}
        ></div>
      </div>
      <div className="flex justify-between">
        <span className="text-text-secondary text-xs">
          {formatCurrentTime(currentTime)}
        </span>
        <span className="text-text-secondary text-xs">
          {formatDuration(durations)}
        </span>
      </div>
    </div>
  );
}
