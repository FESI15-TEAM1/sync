'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/Button';
import PlaylistCard from '@/components/domain/PlaylistCard';
import Input from '@/components/Input';
import Textarea from '@/components/Textarea';

type playlistIds = {
  id: number;
};

export default function AddForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Array<playlistIds>>(
    [],
  );

  const handlePlaylistSelect = (playlistId: number) => {
    if (selectedPlaylist.some((playlist) => playlist.id === playlistId)) {
      setSelectedPlaylist((prevSelected) =>
        prevSelected.filter((playlist) => playlist.id !== playlistId),
      );
    } else {
      setSelectedPlaylist((prevSelected) => [
        ...prevSelected,
        { id: playlistId },
      ]);
    }
  };

  const playListDummy = [
    {
      id: 1,
      title: '아냐 포져가 만든 플레이리스트',
      trackCount: 1,
    },
    {
      id: 21,
      title: '내 최애곡 플레이리스트',
      trackCount: 19,
    },
    {
      id: 3,
      title: '노래방에서 부를 노래들',
      trackCount: 33,
    },
    {
      id: 45,
      title: '불금 일렉트로닉;;',
      trackCount: 25,
    },
    {
      id: 55,
      title: '지인에게 추천받은 곡들',
      trackCount: 58,
    },
  ];

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* headline */}
      <h2 className="text-xl font-bold text-white">플레이룸 시작하기</h2>

      {/* live type notice */}
      <div className="bg-bg-card text-text-secondary flex items-center justify-center rounded-lg py-2 text-xs font-semibold">
        🔴 라이브
      </div>

      {/* set playroom title */}
      <Input
        label="제목"
        placeholder="예: 금귀인 내가 말아주는 플레이리스트!"
        width="100%"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        value={title}
      />

      {/* set playroom description */}
      <Textarea
        label="내용"
        placeholder="플레이룸을 설명하는 내용입니다."
        width="100%"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        value={description}
      />

      {/* pick playlist */}
      <h3 className="text-base font-bold text-white">
        공유 할 플레이리스트 선택
      </h3>

      <div className="w-full scrollbar-none overflow-x-scroll">
        <div className="flex w-max gap-4">
          {playListDummy.map((playlist, index) => (
            <div
              className="relative cursor-pointer"
              key={index}
              onClick={() => handlePlaylistSelect(playlist.id)}
            >
              <PlaylistCard
                title={playlist.title}
                trackCount={playlist.trackCount}
              />
              <div
                className={`${selectedPlaylist.some((item) => item.id === playlist.id) ? 'absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-2xl bg-[rgba(0,0,0,50%)] after:block after:text-white after:content-["selected"]' : ''}`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* buttons */}
      <div className="flex items-center justify-center gap-4">
        <div className="w-auto">
          <Button
            onClick={() => {}}
            isDisabled={!title || !description || selectedPlaylist.length === 0}
            className="w-5"
          >
            생성하기
          </Button>
        </div>

        <button
          onClick={() => {
            router.back();
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}
