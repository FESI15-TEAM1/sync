'use client';

import ChatMembers from '@/app/playroom/[playroomId]/_components/Chat/ChatMembers';
import Player from '@/app/playroom/[playroomId]/_components/Player/Player';

import { useGetPlayroomData } from '../_hooks/useGetPlayroomData';
import { useWSConnect } from '../_hooks/useWSConnect';
import PlayroomHeader from './Header';

export type ChatMessage = {
  username: string;
  message: string;
};

export default function Playroom({ playroomId }: { playroomId: number }) {
  const { messages, sendMessage, members } = useWSConnect(playroomId);
  // playroomId로 데이터를 가져와서 Player, Playlist, Chatting 컴포넌트에 전달합니다.
  const { playroomData, errorMessage, isPending } =
    useGetPlayroomData(playroomId);

  // 방장이 재생을 시작하기 전에는 currentTrack 이 null 입니다.
  const currentTrack = playroomData?.currentTrack;

  return (
    <div className="grid h-[var(--main-content-full-height)] min-h-0 grid-rows-[auto_1fr] gap-4">
      <PlayroomHeader
        playroomId={playroomId}
        playroomTitle={playroomData?.title ?? ''}
        playroomDescription={playroomData?.description ?? ''}
        isHost={playroomData?.isHost ?? false}
      />

      {isPending ? (
        <div className="flex h-full w-full items-center justify-center">
          <p role="status" className="text-text-primary font-bold">
            로딩중...
          </p>
        </div>
      ) : errorMessage ? (
        <div className="flex h-full w-full items-center justify-center">
          <p role="alert" className="text-red-500">
            {errorMessage}
          </p>
        </div>
      ) : (
        <div className="grid min-h-0 auto-cols-fr grid-rows-[auto_1fr] flex-col items-start justify-between gap-4 lg:grid-cols-[300px_1fr] lg:grid-rows-[1fr]">
          <Player
            trackId={currentTrack?.videoId ?? ''}
            musicTitle={currentTrack?.title ?? ''}
            artist={currentTrack?.artist ?? ''}
            thumbnail={currentTrack?.thumbnail ?? ''}
            currentTime={currentTrack?.currentTime ?? 0}
            isPlaying={currentTrack?.isPlaying ?? false}
            isHost={playroomData?.isHost ?? false}
          />

          <ChatMembers
            messages={messages}
            sendMessage={sendMessage}
            members={members}
          />
        </div>
      )}
    </div>
  );
}
