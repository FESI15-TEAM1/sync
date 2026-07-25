'use client';

import { useEffect, useRef, useState } from 'react';

import SettingsIcon from '@/assets/icons/settings.svg';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';

type Playlist = {
  id: number;
  title: string;
  songCount: number;
  gradientClassName: string;
};

const MOCK_GROUP = {
  name: '인디밴드 러버스',
  memberCount: 32,
  playlistCount: 14,
  inviteCode: 'IN9X2K',
};

const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 1,
    title: '비 오는 날 감성',
    songCount: 18,
    gradientClassName: 'from-[#6366f1] to-[#c084fc]',
  },
  {
    id: 2,
    title: '헤비로테',
    songCount: 32,
    gradientClassName: 'from-[#38bdf8] to-[#4f46e5]',
  },
  {
    id: 3,
    title: '어쿠스틱 셋리스트',
    songCount: 11,
    gradientClassName: 'from-[#34d399] to-[#a3e635]',
  },
  {
    id: 4,
    title: '신스팝 모음',
    songCount: 20,
    gradientClassName: 'from-[#d946ef] to-[#6366f1]',
  },
  {
    id: 5,
    title: '라이브 다시듣기',
    songCount: 9,
    gradientClassName: 'from-[#fbbf24] to-[#f43f5e]',
  },
];

export default function GroupPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleSharePlaylist = () => {
    //플레이리스트 공유 플로우 연동
    console.log('공유하기 버튼 클릭');
  };

  const handleEditGroupInfo = () => {
    setIsMenuOpen(false);
    //그룹 정보 수정 페이지 이동
    console.log('그룹 정보 수정 버튼 클릭');
  };

  const handleEditPlaylists = () => {
    setIsMenuOpen(false);
    //플레이리스트 편집 모드 연동
    console.log('플레이리스트 편집 버튼 클릭');
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-5 py-8 md:px-8">
      <section className="bg-bg-card flex flex-col gap-5 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div
            aria-hidden
            className="size-16 shrink-0 rounded-2xl bg-linear-to-br from-[#7c5cff] to-[#f0abfc] sm:size-20"
          />
          <div className="min-w-0">
            <h1 className="text-text-primary truncate text-2xl font-bold sm:text-3xl">
              {MOCK_GROUP.name}
            </h1>
            <p className="text-text-secondary mt-1.5 text-sm sm:text-base">
              멤버 {MOCK_GROUP.memberCount}명 · 플레이리스트{' '}
              {MOCK_GROUP.playlistCount}개 · 초대코드 {MOCK_GROUP.inviteCode}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            size="md"
            isDisabled={false}
            className="w-auto rounded-2xl px-5"
            onClick={handleSharePlaylist}
          >
            플레이리스트 공유
          </Button>

          <div className="relative" ref={menuRef}>
            <IconButton
              variants="secondary"
              size="lg"
              className="border-text-secondary/30 border"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <SettingsIcon className="text-text-primary size-5" />
            </IconButton>

            {isMenuOpen && (
              <div className="absolute top-12 right-0 z-10 w-max min-w-40 rounded-lg bg-zinc-800 p-2">
                <div
                  className="cursor-pointer px-4 py-3 whitespace-nowrap text-white hover:bg-zinc-700"
                  onClick={handleEditGroupInfo}
                >
                  그룹 정보 수정
                </div>
                <div
                  className="cursor-pointer px-4 py-3 whitespace-nowrap text-white hover:bg-zinc-700"
                  onClick={handleEditPlaylists}
                >
                  플레이리스트 편집
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="text-text-primary text-xl font-bold">
          멤버들이 공유한 플레이리스트
        </h2>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {MOCK_PLAYLISTS.map((playlist) => (
            <div key={playlist.id} className="flex flex-col gap-3">
              <div
                aria-hidden
                className={`aspect-square rounded-2xl bg-linear-to-br ${playlist.gradientClassName}`}
              />
              <div className="min-w-0">
                <h4 className="text-text-primary truncate text-base font-semibold">
                  {playlist.title}
                </h4>
                <span className="text-text-secondary text-sm">
                  {playlist.songCount}곡
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
