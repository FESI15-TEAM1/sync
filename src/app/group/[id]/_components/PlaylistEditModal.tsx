'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import Track from '@/components/domain/Track';
import IconButton from '@/components/IconButton';
import InputField from '@/components/InputField';
import Modal from '@/components/Modal';

export type EditablePlaylist = {
  id: number;
  title: string;
  artist: string;
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
}: {
  playlist: EditablePlaylist;
  onRemove: () => void;
}) {
  return (
    <li>
      <Track
        videoId={String(playlist.id)}
        title={playlist.title}
        artist={playlist.artist}
        Button={
          <IconButton
            type="button"
            size="sm"
            variants="secondary"
            aria-label={`${playlist.title} 제거`}
            onClick={onRemove}
            className="border-border text-text-secondary hover:text-text-primary flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border text-sm"
          >
            ✕
          </IconButton>
        }
      />
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

  const filteredAvailable = available.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearch = () => {
    setSearchTerm(query.trim());
  };

  const handleRemove = (id: number) => {
    const target = added.find((item) => item.id === id);

    if (!target) return;

    setAdded((prev) => prev.filter((item) => item.id !== id));

    setAvailable((prev) => [...prev, target]);
  };

  const handleAdd = (id: number) => {
    const target = available.find((item) => item.id === id);

    if (!target) return;

    setAvailable((prev) => prev.filter((item) => item.id !== id));

    setAdded((prev) => [...prev, target]);
  };

  return (
    <Modal isOpen onClose={onClose}>
      {/* Header */}
      <Modal.Header>플레이리스트 목록</Modal.Header>

      {/* Body */}
      <Modal.Body>
        {/* 검색 */}
        <div className="mb-5 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <InputField>
              <InputField.Input
                placeholder="내 플레이리스트 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <InputField.Button
                disabled={false}
                onClick={handleSearch}
                className="h-11 w-auto shrink-0 rounded-full px-5"
              >
                검색
              </InputField.Button>
            </InputField>
          </div>
        </div>

        {/* 플레이리스트 목록 */}
        <div className="space-y-5">
          {/* 추가된 플레이리스트 */}

          {/* 추가 가능한 플레이리스트 */}
          <div>
            <h3 className="text-text-secondary mb-2 text-sm">
              검색된 플레이리스트({filteredAvailable.length})
            </h3>

            <ul>
              {filteredAvailable.map((playlist) => (
                <Track
                  key={playlist.id}
                  videoId={String(playlist.id)}
                  title={playlist.title}
                  artist={playlist.artist}
                  Button={
                    <IconButton
                      type="button"
                      size="sm"
                      className="border-border text-text-secondary hover:text-text-primary text-md flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border"
                      variants="secondary"
                      onClick={() => handleAdd(playlist.id)}
                    >
                      +
                    </IconButton>
                  }
                />
              ))}
            </ul>
          </div>
          <div>
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
          </div>
        </div>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
}
