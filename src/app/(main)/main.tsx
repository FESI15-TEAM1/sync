import Section from '@/app/(main)/_components/Section';
import PublicGroupList from '@/components/domain/group/PublicGroupList';
import PlayroomList from '@/components/domain/playroom/PlayroomList';
import { type PlayroomCardData } from '@/services/playroom/playroom.types';

import PublicPlaylistCardList from './_components/PublicPlaylistCardList';

export default function Main() {
  const playroomDummy: PlayroomCardData[] = [
    {
      id: 3,
      title: '새벽 감성방',
      description:
        '새벽 감성방에 오신 것을 환영합니다. 이 방은 새벽 감성을 공유하는 공간입니다.',
      hashtags: ['Jazz', 'Blues', 'Indie', 'Ballad', 'R&B'],
      listenerCount: 1,
      isLive: true,
      host: { userId: 1, nickname: '김디제이', image: null },
    },
    {
      id: 7,
      title: '드라이브 플리',
      description:
        '창문 내리고 달릴 때 듣기 좋은 곡만 모았습니다. 신나는 노래 환영해요.',
      hashtags: ['Pop', 'Rock', 'Dance', 'City Pop'],
      listenerCount: 3,
      isLive: false,
      host: { userId: 2, nickname: '창문내린김대리', image: null },
    },
    {
      id: 54,
      title: '집중 코딩방',
      description:
        '가사 없는 음악만 틀어주세요. 조용히 각자 할 일 하는 작업 공간입니다.',
      hashtags: ['Lo-fi', 'Ambient', 'Classical', 'Piano'],
      listenerCount: 15,
      isLive: false,
      host: { userId: 3, nickname: '이어폰붙박이', image: null },
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <Section
        headline="현재 핫한 플레이룸🔥"
        list={<PlayroomList data={playroomDummy} />}
      />
      <Section
        headline="새로 생긴 플레이리스트!"
        list={<PublicPlaylistCardList />}
      />
      <Section headline="최근 그룹 목록" list={<PublicGroupList />} />
    </div>
  );
}
