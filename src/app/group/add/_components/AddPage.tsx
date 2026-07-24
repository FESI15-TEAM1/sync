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

export default function AddPage() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 사용자가 선택한 파일(file)을 브라우저에서 미리 볼 수 있는 임시 URL 생성
    const url = URL.createObjectURL(file);
    // 기존에 저장되어 있던 미리보기 URL을 확인하면서 상태 업데이트
    setCoverPreview((prev) => {
      // 이전 미리보기 URL이 있다면 더 이상 사용하지 않으므로 메모리에서 해제
        if (prev) URL.revokeObjectURL(prev);
      // 새로 만든 이미지 미리보기 URL을 상태에 저장
        return url;
    });
  };

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e?: SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();
    console.log({
      groupName,
      isPublic,
      selectedPlaylists,
      coverPreview: coverPreview ?? defaultCover.src,
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-8 px-5 py-6">
      <form className="flex flex-col gap-5">
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
          placeholder="그룹 이름을 입력해주세요."
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
          onClick={() => handleSubmit()}
        >
          그룹 생성하기
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
