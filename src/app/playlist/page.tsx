import PlaylistCard from '@/components/domain/PlaylistCard';

import PlaylistCardList from './_components/PlayListCardLIst';

export const data = {
  items: [
    {
      id: 1,
      title: '비오는날 감성',
      description: '빗소리와 잘 어울리는 잔잔한 플레이리스트',
      image: 'https://picsum.photos/seed/rain1/400/400',
      isPublic: true,
      trackCount: 18,
      createdAt: '2026-07-20T09:00:00Z',
    },
    {
      id: 2,
      title: '출근길 텐션업',
      description: '아침을 깨워주는 신나는 곡 모음',
      image: 'https://picsum.photos/seed/morning2/400/400',
      isPublic: true,
      trackCount: 24,
      createdAt: '2026-07-18T07:30:00Z',
    },
    {
      id: 3,
      title: '새벽 감성 R&B',
      description: '잠 안 올 때 듣는 곡들',
      image: 'https://picsum.photos/seed/night3/400/400',
      isPublic: false,
      trackCount: 12,
      createdAt: '2026-07-15T23:15:00Z',
    },
    {
      id: 4,
      title: '카페에서 듣기 좋은 노래',
      description: '잔잔하고 편안한 어쿠스틱 위주',
      image: 'https://picsum.photos/seed/cafe4/400/400',
      isPublic: true,
      trackCount: 30,
      createdAt: '2026-07-10T14:20:00Z',
    },
    {
      id: 5,
      title: '운동할 때 필수',
      description: '고강도 운동용 EDM/힙합 믹스',
      image: 'https://picsum.photos/seed/workout5/400/400',
      isPublic: true,
      trackCount: 20,
      createdAt: '2026-07-05T18:00:00Z',
    },
  ],
  nextCursor: null,
};
export interface PlaylistItem {
  id: number;
  title: string;
  description: string;
  image: string;
  isPublic: boolean;
  trackCount: number;
  createdAt: string;
}

export default function PlayList() {
  return (
    <div className="p-2">
      <PlaylistCardList data={data.items} />;
    </div>
  );
}
