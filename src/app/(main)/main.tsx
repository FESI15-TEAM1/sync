import Section from '@/app/(main)/_components/Section';
import GroupList from '@/components/domain/group/GroupList';
import PlaylistCardList from '@/components/domain/playlists/PlaylistCardList';
import PlayroomList from '@/components/domain/playroom/PlayroomList';
import { type GroupSummary } from '@/services/group/group.types';
import { type PlayroomCardData } from '@/services/playroom/playroom.types';

export default function Main() {
  const playroomDummy: PlayroomCardData[] = [
    {
      id: 3,
      title: '새벽 감성방',
      description:
        '새벽 감성방에 오신 것을 환영합니다. 이 방은 새벽 감성을 공유하는 공간입니다.',
      hashtags: ['Jazz', 'Blues', 'Indie', 'Ballad', 'R&B'],
      listenerCount: 1,
      host: { userId: 1, nickname: '김디제이', image: null },
    },
    {
      id: 7,
      title: '드라이브 플리',
      description:
        '창문 내리고 달릴 때 듣기 좋은 곡만 모았습니다. 신나는 노래 환영해요.',
      hashtags: ['Pop', 'Rock', 'Dance', 'City Pop'],
      listenerCount: 3,
      host: { userId: 2, nickname: '창문내린김대리', image: null },
    },
    {
      id: 54,
      title: '집중 코딩방',
      description:
        '가사 없는 음악만 틀어주세요. 조용히 각자 할 일 하는 작업 공간입니다.',
      hashtags: ['Lo-fi', 'Ambient', 'Classical', 'Piano'],
      listenerCount: 15,
      host: { userId: 3, nickname: '이어폰붙박이', image: null },
    },
  ];

  const groupDummy: GroupSummary[] = [
    { id: 1, title: '또 나왔어', memberCount: 1, playlistCount: 1 },
    { id: 2, title: '나도 너무 좋아', memberCount: 1, playlistCount: 1 },
    { id: 3, title: '안녕안녕', memberCount: 1, playlistCount: 1 },
    { id: 4, title: '안녕하세요', memberCount: 1, playlistCount: 1 },
    {
      id: 5,
      title: '나도 여자랍니다',
      image: 'https://picsum.photos/seed/group5/200/200',
      memberCount: 1,
      playlistCount: 1,
    },
    {
      id: 6,
      title: '반갑습니다',
      memberCount: 1,
      playlistCount: 1,
    },
  ];

  const playlistDummy = [
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
  ];
  return (
    <div className="flex flex-col gap-12">
      <Section
        headline="현재 핫한 플레이룸🔥"
        list={<PlayroomList data={playroomDummy} />}
      />
      <Section
        headline="새로 생긴 플레이리스트!"
        list={<PlaylistCardList data={playlistDummy} />}
      />
      <Section
        headline="최근 그룹 목록"
        list={<GroupList data={groupDummy} />}
      />
    </div>
  );
}
