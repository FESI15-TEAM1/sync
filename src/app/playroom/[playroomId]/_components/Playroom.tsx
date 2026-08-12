'use client';

import ChatMembers from '@/app/playroom/[playroomId]/_components/Chat/ChatMembers';
import Player from '@/app/playroom/[playroomId]/_components/Player/Player';

import { useChatMessages } from '../_hooks/useChatMessages';
import { useGetPlaylistData } from '../_hooks/useGetPlaylistData';
import { useGetPlayroomData } from '../_hooks/useGetPlayroomData';
import { useWSConnect } from '../_hooks/useWSConnect';
import PlayroomHeader from './Header';

export type ChatMessage = {
  id: number;
  username: string;
  // 프로필 이미지가 없거나 탈퇴한 유저면 null 입니다.
  userImage: string | null;
  message: string;
  createdAt: string;
};

export default function Playroom({ playroomId }: { playroomId: number }) {
  const {
    messages: liveMessages,
    sendMessage,
    playback,
    playbackControl,
    memberJoinedCount,
  } = useWSConnect(playroomId);
  // 접속 전 대화는 WebSocket 으로 오지 않으므로, 지난 채팅 기록과 합쳐서 보여줍니다.
  const { messages, errorMessage: chatHistoryErrorMessage } = useChatMessages(
    playroomId,
    liveMessages,
  );
  // playroomId로 데이터를 가져와서 Player, Playlist, Chatting 컴포넌트에 전달합니다.
  const { playroomData, errorMessage, isPending } =
    useGetPlayroomData(playroomId);

  const isHost = playroomData?.isHost ?? false;

  // 플레이리스트는 방장만 받아옵니다. 참가자는 방장의 플레이리스트에 접근하지 못할 수 있고,
  // 재생에 필요한 곡 정보는 방 상세의 currentTrack 으로 충분하기 때문입니다.
  // playlistId 는 방 상세를 받아야 알 수 있습니다.
  const { playlistData } = useGetPlaylistData(
    isHost ? playroomData?.playlistId : undefined,
  );

  // 방장이 재생을 시작하기 전에는 currentTrack 이 null 입니다.
  const currentTrack = playroomData?.currentTrack ?? null;

  // 접속 중인 참가자 목록. 입퇴장이 생기면 useWSConnect 가 방 상세를 다시 받아오게 합니다.
  const members = (playroomData?.members ?? []).map((member) => ({
    userId: member.userId,
    username: member.nickname,
    userImage: member.image,
  }));

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
            tracks={playlistData?.tracks ?? []}
            currentTrack={currentTrack}
            isHost={isHost}
            playback={playback}
            onPlaybackChange={playbackControl}
            memberJoinedCount={memberJoinedCount}
          />

          <ChatMembers
            messages={messages}
            historyErrorMessage={chatHistoryErrorMessage}
            sendMessage={sendMessage}
            members={members}
          />
        </div>
      )}
    </div>
  );
}
