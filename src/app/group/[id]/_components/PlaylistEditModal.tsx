'use client';

import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import Input from '@/components/Input';

export type EditablePlaylist = {
  id: string;
  title: string;
  subtitle: string;
  trackCount: number;
};

type PlaylistEditModalProps = {
  isOpen: boolean;
  addedPlaylists: EditablePlaylist[];
  availablePlaylists: EditablePlaylist[];
  onClose: () => void;
  onSave: (playlists: EditablePlaylist[]) => void;
};

function PlaylistRow({
  playlist,
  onRemove,
  onSelect,
}: {
  playlist: EditablePlaylist;
  onRemove?: () => void;
  onSelect?: () => void;
}) {
  return (
    <li className="flex items-center gap-3 py-2">
      <button
        type="button"
        onClick={onSelect}
        disabled={!onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left disabled:cursor-default"
      >
        <div className="bg-input size-12 shrink-0 rounded-md" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-text-primary truncate text-sm font-medium">
            {playlist.title}
          </p>
          <p className="text-text-secondary truncate text-xs">
            {playlist.subtitle}
          </p>
        </div>
      </button>
      {onRemove ? (
        <button
          type="button"
          aria-label={`${playlist.title} 제거`}
          onClick={onRemove}
          className="border-border text-text-secondary hover:text-text-primary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-xs"
        >
          ✕
        </button>
      ) : null}
    </li>
  );
}

export default function PlaylistEditModal({
  isOpen,
  ...props
}: PlaylistEditModalProps) {
  if (!isOpen) return null;
  return <PlaylistEditModalContent {...props} />;
}

function PlaylistEditModalContent({
  addedPlaylists,
  availablePlaylists,
  onClose,
  onSave,
}: Omit<PlaylistEditModalProps, 'isOpen'>) {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [added, setAdded] = useState<EditablePlaylist[]>(addedPlaylists);
  const [available, setAvailable] =
    useState<EditablePlaylist[]>(availablePlaylists);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredAvailable = available.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearch = () => {
    setSearchTerm(query.trim());
  };

  const handleRemove = (id: string) => {
    const target = added.find((item) => item.id === id);
    if (!target) return;
    setAdded((prev) => prev.filter((item) => item.id !== id));
    setAvailable((prev) => [...prev, target]);
  };

  const handleAdd = (id: string) => {
    const target = available.find((item) => item.id === id);
    if (!target) return;
    setAvailable((prev) => prev.filter((item) => item.id !== id));
    setAdded((prev) => [...prev, target]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="playlist-edit-title"
        className="bg-bg-primary flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="playlist-edit-title"
            className="text-text-primary text-lg font-bold"
          >
            플레이리스트 목록
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="text-text-primary cursor-pointer px-1 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <Input
              placeholder="내 플레이리스트 검색"
              value={query}
              width="100%"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
          </div>
          <Button
            type="button"
            size="md"
            isDisabled={false}
            onClick={handleSearch}
            className="h-11 w-auto shrink-0 rounded-full px-5"
          >
            검색
          </Button>
        </div>

        <div className="flex-1 scrollbar-none space-y-5 overflow-y-auto">
          <section>
            <h3 className="text-text-secondary mb-2 text-sm">
              추가된 플레이리스트({added.length})
            </h3>
            <ul>
              {added.map((playlist) => (
                <PlaylistRow
                  key={playlist.id}
                  playlist={playlist}
                  onRemove={() => handleRemove(playlist.id)}
                />
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-text-secondary mb-2 text-sm">
              플레이리스트({filteredAvailable.length})
            </h3>
            <ul>
              {filteredAvailable.map((playlist) => (
                <PlaylistRow
                  key={playlist.id}
                  playlist={playlist}
                  onSelect={() => handleAdd(playlist.id)}
                />
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2">
          <Button
            type="button"
            size="md"
            variant="outline"
            isDisabled={false}
            onClick={onClose}
            className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
          >
            취소
          </Button>
          <Button
            type="button"
            size="md"
            variant="primary"
            isDisabled={false}
            onClick={() => onSave(added)}
            className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
          >
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}
