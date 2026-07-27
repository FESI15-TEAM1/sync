'use client';

import Image from 'next/image';
import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import defaultCover from '@/assets/images/default.png';
import Button from '@/components/Button';
import PlaylistCard from '@/components/domain/PlaylistCard';
import Input from '@/components/Input';

type Playlist = {
  id: string;
  title: string;
  songCount: number;
};

const MOCK_PLAYLISTS: Playlist[] = [
  { id: '1', title: '비 오는 날 감성', songCount: 10 },
  { id: '2', title: '헤비로터', songCount: 20 },
  { id: '3', title: '새벽 드라이브', songCount: 30 },
];

type EditPageProps = {
  groupId: string;
};

export default function EditPage({ groupId }: EditPageProps) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('인디밴드 러버스');
  const [groupDescription, setGroupDescription] = useState(
    '인디 음악을 좋아하는 사람들의 모임',
  );
  const [isPublic, setIsPublic] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>(['1']);

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCoverPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      groupId,
      groupName,
      groupDescription,
      isPublic,
      selectedPlaylists,
      coverPreview: coverPreview ?? defaultCover.src,
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-6">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <label
            htmlFor="image-upload"
            className="flex cursor-pointer items-center gap-3"
          >
            <Image
              src={coverPreview ?? defaultCover}
              alt="그룹 커버"
              width={72}
              height={72}
              className="h-18 w-18 rounded-2xl object-cover"
            />
            <span className="text-primary text-sm">커버 이미지 변경</span>
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
        </div>
        <Input
          label="그룹 이름"
          value={groupName}
          placeholder="그룹 이름을 입력해주세요."
          onChange={(e) => setGroupName(e.target.value)}
          width="100%"
        />
        <Input
          label="그룹 소개"
          value={groupDescription}
          placeholder="그룹 소개를 입력해주세요."
          onChange={(e) => setGroupDescription(e.target.value)}
          width="100%"
        />
        <fieldset className="flex flex-col gap-2">
          <legend className="text-md ml-2 font-bold text-white">
            공개 여부
          </legend>
          <div className="border-border bg-bg-card flex overflow-hidden rounded-md border">
            <label
              className={`flex-1 cursor-pointer py-2 text-center text-sm ${
                isPublic
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={isPublic}
                onChange={() => setIsPublic(true)}
                className="sr-only"
              />
              공개
            </label>
            <label
              className={`flex-1 cursor-pointer py-2 text-center text-sm ${
                !isPublic
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={!isPublic}
                onChange={() => setIsPublic(false)}
                className="sr-only"
              />
              비공개
            </label>
          </div>
        </fieldset>
        <Button
          isDisabled={
            !groupName || !groupDescription || selectedPlaylists.length === 0
          }
        >
          수정하기
        </Button>
        <section>
          <h2 className="text-md ml-2 font-bold text-white">
            플레이리스트 추가
          </h2>
          <ul>
            <div className="w-full scrollbar-none overflow-x-scroll">
              <div className="flex w-max gap-4">
                {MOCK_PLAYLISTS.map((playlist) => {
                  const isSelected = selectedPlaylists.includes(playlist.id);

                  return (
                    <div
                      className="relative cursor-pointer"
                      key={playlist.id}
                      onClick={() => togglePlaylist(playlist.id)}
                    >
                      <PlaylistCard
                        id={playlist.id}
                        title={playlist.title}
                        trackCount={playlist.songCount}
                      />
                      {isSelected && (
                        <div className='absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-2xl bg-[rgba(0,0,0,50%)] after:block after:text-white after:content-["selected"]' />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ul>
        </section>
      </form>
    </main>
  );
}
