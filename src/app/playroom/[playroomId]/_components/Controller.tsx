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
      <button
        className="text-white"
        title="이전 곡 재생"
        onClick={() => {
          isHost ? playPreviousTrack() : alert('방장만 조절 가능합니다.');
        }}
      >
        &lt;
      </button>
      <button
        className="text-white"
        title="재생/일시정지"
        onClick={() => {
          isHost ? playPause() : alert('방장만 조절 가능합니다.');
        }}
      >
        {isPlaying ? '일시정지' : '재생'}
      </button>
      <button
        className="text-white"
        title="다음 곡 재생"
        onClick={
          isHost ? playNextTrack : () => alert('방장만 조절 가능합니다.')
        }
      >
        &gt;
      </button>
    </div>
  );
}
