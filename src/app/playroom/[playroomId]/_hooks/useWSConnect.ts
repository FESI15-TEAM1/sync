import { Client, type IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

import { getAccessToken } from '@/services/auth/token.api';

import type { MemberType } from '../_components/Chat/MemberItem';
import type { ChatMessage } from '../_components/Playroom';

export function useWSConnect(playroomId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [members, setMembers] = useState<MemberType[]>([]);

  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: process.env.NEXT_PUBLIC_WS_URL,
      reconnectDelay: 5000,
      beforeConnect: async () => {
        // 재연결마다 호출되므로 만료된 토큰으로 붙는 것을 막을 수 있다
        try {
          const { accessToken } = await getAccessToken();
          stompClient.connectHeaders = {
            Authorization: `Bearer ${accessToken}`,
          };
        } catch {
          // 토큰이 없으면(재로그인 필요) 연결을 시도하지 않는다
          stompClient.connectHeaders = {};
          await stompClient.deactivate();
        }
      },
      onConnect: () => {
        stompClient.subscribe(
          `/topic/playrooms/${playroomId}`,
          (msg: IMessage) => {
            const e = JSON.parse(msg.body);
            console.log(e);
            switch (e.type) {
              case 'member_joined':
                // { member, listenerCount } - 참가자 추가 (이미 있으면 무시)
                setMembers((prev) =>
                  prev.some((member) => member.userId === e.member.userId)
                    ? prev
                    : [
                        ...prev,
                        {
                          userId: e.member.userId,
                          username: e.member.nickname,
                          userImage: e.member.image,
                        },
                      ],
                );
                break;
              case 'member_left':
                // { member, listenerCount } - 참가자 제거
                setMembers((prev) =>
                  prev.filter((member) => member.userId !== e.member.userId),
                );
                break;
              case 'playback_sync':
                //  { videoId, isPlaying, currentTime } - 재생 상태
                break;
              case 'chat_message':
                // { id, sender, message, createAt } - 채팅에 append
                setMessages((prev) => [
                  ...prev,
                  { username: e.sender.nickname, message: e.message },
                ]);
                break;
              case 'room_closed':
                // {} - 방 닫힘
                break;
            }
          },
        );

        stompClient.subscribe(
          `/user/queue/playrooms/${playroomId}`,
          (msg: IMessage) => {
            const s = JSON.parse(msg.body);
            // console.log(
            //   `snapshot: ${s.type}, ${s.playback}, ${s.members}, ${s.listenerCount}`,
            // );
          },
        );
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [playroomId]);

  // 채팅 보내기
  const sendMessage = (message: string) => {
    stompClientRef.current?.publish({
      destination: `/app/playrooms/${playroomId}/chat`,
      body: JSON.stringify({ message }),
    });
  };

  // 재생 컨트롤
  const playbackControl = ({
    videoId,
    isPlaying,
    currentTime,
  }: {
    videoId: string;
    isPlaying: boolean;
    currentTime: number;
  }) => {
    stompClientRef.current?.publish({
      destination: `/app/playrooms/${playroomId}/playback`,
      body: JSON.stringify({ videoId, isPlaying, currentTime }),
    });
  };

  return { messages, sendMessage, playbackControl, members };
}
