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

    if (!durationInSeconds) return 0;

    return Math.min(
      100,
      Math.max(0, (currentTimeInSeconds / durationInSeconds) * 100),
    );
  };

  const fullDuration = formatDuration(durations);
  const currentPlayTime = formatCurrentTime(currentTime);
  const progressBarWidth = progressPercentage(currentPlayTime, fullDuration);

  return (
    <div className="-mt-2 w-full max-w-[60%] lg:max-w-[80%]">
      <div className="bg-bg-primary h-1 w-full rounded-full">
        <div
          className="bg-primary h-1 rounded-full transition-all duration-300"
          style={{ width: `${progressBarWidth}%` }}
        ></div>
      </div>
      <div className="flex justify-between">
        <span className="text-text-secondary text-xs">{currentPlayTime}</span>
        <span className="text-text-secondary text-xs">{fullDuration}</span>
      </div>
    </div>
  );
}
