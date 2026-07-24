import ChatMembers from '@/app/playroom/[playroomId]/_components/ChatMembers';
import Player from '@/app/playroom/[playroomId]/_components/Player';

import PlayroomHeader from './_components/Header';

export default function Stream({ playroomId }: { playroomId: number }) {
  // playroomId로 데이터를 가져와서 Player, Playlist, Chatting 컴포넌트에 전달합니다.

  const playroomDummy = {
    id: playroomId,
    title: '명한이와 신나는 라이브',
    description: '떠블디와 함께하는 특별한밤 오늘밤은 모두 출석 체!크!',
    hashtags: ['제이팝'],
    isLive: true,
    isHost: true,
    host: {
      userId: 3,
      nickname: '명한',
      image: 'https://picsum.photos/250/250',
    },
    listenerCount: 6,
    playlistId: 1,
    currentTrack: {
      videoId: 'dQw4w9WgXcQ',
      title: 'Never Gonna Give You Up',
      artist: 'Rick Astley',
      thumbnail: 'https://picsum.photos/250/250',
      currentTime: 22.2,
      isPlaying: true,
    },
    members: [
      { userId: 1, nickname: '정우', image: 'https://picsum.photos/250/250' },
    ],
    createdAt: '2026-07-21T12:00:00Z',
  };

  return (
    <>
      <PlayroomHeader playroomTitle={playroomDummy.title} />

      <Player
        trackId={playroomDummy.currentTrack.videoId}
        musicTitle={playroomDummy.currentTrack.title}
        artist={playroomDummy.currentTrack.artist}
        thumbnail={playroomDummy.currentTrack.thumbnail}
        currentTime={playroomDummy.currentTrack.currentTime}
        isPlaying={playroomDummy.currentTrack.isPlaying}
        isHost={playroomDummy.isHost}
      />

      {/* <Playlist /> */}

      <ChatMembers />
    </>
  );
}
