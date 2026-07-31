import AddButton from '@/app/stage/_components/AddButton';
import PlayroomList from '@/app/stage/_components/PlayroomList';

export default function Stage() {
  const playroomDummy = [
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
    {
      id: 60,
      title: '90년대 가요 감상실',
      description:
        '추억의 90년대 명곡을 함께 들어요. 그 시절 이야기도 나눠주세요.',
      hashtags: ['K-Pop', 'Ballad', 'Trot', 'Rock'],
      listenerCount: 9,
      host: '삐삐받던오빠',
    },
    {
      id: 244,
      title: '힙합 사이퍼',
      description:
        '국힙 원탑을 가리는 방. 최신 힙합부터 붐뱁까지 자유롭게 틀어주세요.',
      hashtags: ['Hip-hop', 'Rap', 'Trap', 'R&B'],
      listenerCount: 18,
      host: '라임뱉는떡볶이',
    },
    {
      id: 165,
      title: '주말 밤 클럽',
      description:
        '주말 밤을 불태울 사람 모여라. EDM 좋아하시는 분들 환영합니다.',
      hashtags: ['EDM', 'House', 'Techno', 'Dance'],
      listenerCount: 31,
      host: '내일은월요일',
    },
    {
      id: 56,
      title: '잔잔한 인디 라운지',
      description:
        '조용한 인디 음악 들으며 하루를 마무리하는 방입니다. 편하게 머물다 가세요.',
      hashtags: ['Indie', 'Acoustic', 'Folk', 'Ballad'],
      listenerCount: 4,
      host: '감성충전중',
    },
  ];

  return (
    <>
      <PlayroomList data={playroomDummy} />

      <AddButton />
    </>
  );
}
