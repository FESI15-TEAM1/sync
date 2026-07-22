// Stage: 플레이룸 목록 페이지

import ListItem from './_components/ListItem';

export default function Stage() {
  const dummyData = [
    {
      title: '새벽 감성방',
      description:
        '새벽 감성방에 오신 것을 환영합니다. 이 방은 새벽 감성을 공유하는 공간입니다.',
      genres: ['Jazz', 'Blues', 'Indie', 'Ballad', 'R&B'],
      userCount: 1,
      owner: '김디제이',
    },
    {
      title: '드라이브 플리',
      description:
        '창문 내리고 달릴 때 듣기 좋은 곡만 모았습니다. 신나는 노래 환영해요.',
      genres: ['Pop', 'Rock', 'Dance', 'City Pop'],
      userCount: 3,
      owner: '창문내린김대리',
    },
    {
      title: '집중 코딩방',
      description:
        '가사 없는 음악만 틀어주세요. 조용히 각자 할 일 하는 작업 공간입니다.',
      genres: ['Lo-fi', 'Ambient', 'Classical', 'Piano'],
      userCount: 15,
      owner: '이어폰붙박이',
    },
    {
      title: '90년대 가요 감상실',
      description:
        '추억의 90년대 명곡을 함께 들어요. 그 시절 이야기도 나눠주세요.',
      genres: ['K-Pop', 'Ballad', 'Trot', 'Rock'],
      userCount: 9,
      owner: '삐삐받던오빠',
    },
    {
      title: '힙합 사이퍼',
      description:
        '국힙 원탑을 가리는 방. 최신 힙합부터 붐뱁까지 자유롭게 틀어주세요.',
      genres: ['Hip-hop', 'Rap', 'Trap', 'R&B'],
      userCount: 18,
      owner: '라임뱉는떡볶이',
    },
    {
      title: '주말 밤 클럽',
      description:
        '주말 밤을 불태울 사람 모여라. EDM 좋아하시는 분들 환영합니다.',
      genres: ['EDM', 'House', 'Techno', 'Dance'],
      userCount: 31,
      owner: '내일은월요일',
    },
    {
      title: '잔잔한 인디 라운지',
      description:
        '조용한 인디 음악 들으며 하루를 마무리하는 방입니다. 편하게 머물다 가세요.',
      genres: ['Indie', 'Acoustic', 'Folk', 'Ballad'],
      userCount: 4,
      owner: '감성충전중',
    },
  ];

  return (
    <>
      <ul className="flex flex-col gap-2">
        {dummyData.map((item, index) => (
          <ListItem
            key={index}
            userCount={item.userCount}
            title={item.title}
            description={item.description}
            genres={item.genres}
            owner={item.owner}
          />
        ))}
      </ul>
    </>
  );
}
