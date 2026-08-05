'use client';

import PlaylistCard from '@/components/domain/PlaylistCard';
import { type MyPlaylistItem } from '@/services/playlist/playlistCard.type';

type PlaylistSelectorProps = {
  playlists: MyPlaylistItem[];
  selectedPlaylistId: number | null;
  onSelect: (playlistId: number) => void;
};

export default function PlaylistSelector({
  playlists,
  selectedPlaylistId,
  onSelect,
}: PlaylistSelectorProps) {
  if (playlists.length === 0) {
    return (
      <p className="text-text-secondary text-sm">
        공유할 수 있는 플레이리스트가 없습니다.
      </p>
    );
  }

  return (
    <div className="w-full scrollbar-none overflow-x-scroll pt-2">
      <ul className="flex w-max gap-4">
        {playlists.map((playlist) => {
          const isSelected = playlist.id === selectedPlaylistId;

          return (
            <li key={playlist.id}>
              <button
                type="button"
                onClick={() => onSelect(playlist.id)}
                aria-pressed={isSelected}
                className="relative cursor-pointer rounded-2xl text-left"
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
