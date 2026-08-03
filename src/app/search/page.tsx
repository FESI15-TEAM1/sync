import SearchForm from '@/app/search//_components/SearchForm';
import type { PlayroomListData } from '@/app/stage/_components/PlayroomList';

const playroomDummy: PlayroomListData[] = [
  {
    id: 3,
    title: '새벽 감성방',
    description:
      '새벽 감성방에 오신 것을 환영합니다. 이 방은 새벽 감성을 공유하는 공간입니다.',
    hashtags: ['Jazz', 'Blues', 'Indie', 'Ballad', 'R&B'],
    listenerCount: 1,
    host: '김디제이',
  },
  {
    id: 7,
    title: '드라이브 플리',
    description:
      '창문 내리고 달릴 때 듣기 좋은 곡만 모았습니다. 신나는 노래 환영해요.',
    hashtags: ['Pop', 'Rock', 'Dance', 'City Pop'],
    listenerCount: 3,
    host: '창문내린김대리',
  },
  {
    id: 54,
    title: '집중 코딩방',
    description:
      '가사 없는 음악만 틀어주세요. 조용히 각자 할 일 하는 작업 공간입니다.',
    hashtags: ['Lo-fi', 'Ambient', 'Classical', 'Piano'],
    listenerCount: 15,
    host: '이어폰붙박이',
  },
];

export default function Search() {
  return (
    <div className="w-full overflow-x-hidden">
      <SearchForm data={playroomDummy} />
    </div>
  );
}
