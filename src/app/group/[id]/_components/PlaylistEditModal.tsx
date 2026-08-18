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
  owner: string;
  trackCount: number;
  image?: string;
  ownerId: number;
};

type PlaylistEditModalProps = {
  isOpen: boolean;
  addedPlaylists: EditablePlaylist[];
  availablePlaylists: EditablePlaylist[];
  isLeader: boolean;
  currentUserId: number | null;
  onClose: () => void;
  onSave: (playlists: EditablePlaylist[]) => void;
};

function PlaylistRow({
  playlist,
  canRemove,
  onRemove,
}: {
  playlist: EditablePlaylist;
  canRemove: boolean;
  onRemove: () => void;
}) {
  return (
    <li>
      <Track
        img={playlist.image}
        videoId={String(playlist.id)}
        title={playlist.title}
        // Track은 아티스트 필드를 쓰지만, 여기서는 플레이리스트 소유자(owner)를 표시한다.
        artist={playlist.owner}
        Button={
          canRemove ? (
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
          ) : undefined
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
  isLeader,
  currentUserId,
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

  // 참여자는 본인 소유 플레이리스트만 제거할 수 있고, 남이 담은 건 불변이다.
  const canRemove = (playlist: EditablePlaylist) =>
    isLeader || playlist.ownerId === currentUserId;

  const handleRemove = (id: number) => {
    const target = added.find((item) => item.id === id);

    if (!target || !canRemove(target)) return;

    setAdded((prev) => prev.filter((item) => item.id !== id));

    setAvailable((prev) => [...prev, target]);
  };

  const handleAdd = (id: number) => {
    const target = available.find((item) => item.id === id);

    if (!target) return;

    setAvailable((prev) => prev.filter((item) => item.id !== id));

    setAdded((prev) => [...prev, target]);
  };

  const handleSave = () => {
    // 참여자: 배열 = 내가 담은 것의 최종 목록(본인 소유분만 반영)
    // 그룹장: 배열 = 그룹 전체의 최종 목록(모더레이션 포함)
    const finalPlaylists = isLeader
      ? added
      : added.filter((item) => item.ownerId === currentUserId);

    onSave(finalPlaylists);
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
              내 플레이리스트({filteredAvailable.length})
            </h3>

            <ul>
              {filteredAvailable.map((playlist) => (
                <Track
                  key={playlist.id}
                  img={playlist.image}
                  videoId={String(playlist.id)}
                  title={playlist.title}
                  // Track은 아티스트 필드를 쓰지만, 여기서는 플레이리스트 소유자(owner)를 표시한다.
                  artist={playlist.owner}
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
              그룹에 추가된 플레이리스트({added.length})
            </h3>

            <ul>
              {added.map((playlist) => (
                <PlaylistRow
                  key={playlist.id}
                  playlist={playlist}
                  canRemove={canRemove(playlist)}
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
          onClick={handleSave}
          className="flex h-9 w-28 shrink-0 items-center justify-center rounded-full px-0 font-bold"
        >
          저장하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
