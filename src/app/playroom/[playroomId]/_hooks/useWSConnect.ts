import { Client, type IMessage } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { getAccessToken } from '@/services/auth/token.api';

import type { ChatMessageTypes } from '../_components/Playroom';
import { chatMessagesQueryKey } from './useChatMessages';
import { playroomQueryKey } from './useGetPlayroomData';

/** 방장이 브로드캐스트한 재생 상태. 참가자는 이 값에 자기 플레이어를 맞춥니다. */
export interface PlaybackState {
  videoId: string;
  isPlaying: boolean;
  /** 방장 기준 재생 위치(초) */
  currentTime: number;
  /** 서버가 이 상태를 기록한 시각(ISO). 수신까지 흐른 시간을 보정하는 데 씁니다. */
  updatedAt: string;
}

export function useWSConnect(playroomId: number) {
  const [messages, setMessages] = useState<ChatMessageTypes[]>([]);
  const [playback, setPlayback] = useState<PlaybackState | null>(null);
  // 참가자가 들어올 때마다 늘어납니다. 방장이 현재 재생 상태를 다시 알리는 신호로 씁니다.
  const [memberJoinedCount, setMemberJoinedCount] = useState(0);
  // 방장이 방을 종료했습니다. 참가자에게 안내하고 내보내는 신호로 씁니다.
  const [isRoomClosed, setIsRoomClosed] = useState(false);

  const queryClient = useQueryClient();

  const stompClientRef = useRef<Client | null>(null);
  const hasConnectedRef = useRef(false);
  // 곡이 바뀌었는지 판단하려고 마지막으로 받은 videoId 를 들고 있습니다.
  const lastVideoIdRef = useRef<string | null>(null);

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
        // 접속 직후 나에게만 오는 스냅샷. 방의 현재 재생 상태를 여기서 처음 알게 된다
        stompClient.subscribe(
          `/user/queue/playrooms/${playroomId}`,
          (msg: IMessage) => {
            const s = JSON.parse(msg.body);

            if (s.type !== 'sync_state') return;

            // 방장이 아직 재생을 시작하지 않았으면 playback 이 null 로 옵니다.
            setPlayback(s.playback ?? null);
            lastVideoIdRef.current = s.playback?.videoId ?? null;

            // 방 상세를 받은 뒤에 내가 접속했으므로, 참가자 목록에 나를 포함해 다시 받아옵니다.
            queryClient.invalidateQueries({
              queryKey: playroomQueryKey(playroomId),
            });
          },
        );

        stompClient.subscribe(
          `/topic/playrooms/${playroomId}`,
          (msg: IMessage) => {
            const e = JSON.parse(msg.body);

            switch (e.type) {
              case 'member_joined':
                // 새 참가자는 접속 직후 스냅샷으로만 재생 상태를 받는다. 그 스냅샷이 비어
                // 있거나 낡아 있어도 따라올 수 있도록, 방장이 지금 상태를 다시 알리게 한다.
                setMemberJoinedCount((count) => count + 1);
              // falls through
              case 'member_left':
                // { member, listenerCount } - 참가자 목록과 인원수는 방 상세(REST)가 들고 있으므로
                // 여기서 따로 쌓지 않고 다시 받아오게 한다.
                queryClient.invalidateQueries({
                  queryKey: playroomQueryKey(playroomId),
                });
                break;
              case 'playback_sync':
                // { videoId, isPlaying, currentTime, updatedAt } - 방장의 재생 상태
                // 이벤트에는 videoId 만 오므로, 곡이 바뀌었으면 제목·아티스트·썸네일을
                // 들고 있는 방 상세(REST)를 다시 받아온다.
                if (lastVideoIdRef.current !== e.videoId) {
                  lastVideoIdRef.current = e.videoId;
                  queryClient.invalidateQueries({
                    queryKey: playroomQueryKey(playroomId),
                  });
                }

                // 같은 값이 다시 와도 참가자가 다시 맞출 수 있도록 매번 새 객체로 교체한다.
                setPlayback({
                  videoId: e.videoId,
                  isPlaying: e.isPlaying,
                  currentTime: e.currentTime,
                  updatedAt: e.updatedAt,
                });
                break;
              case 'chat_message':
                // { id, sender, message, createdAt } - 채팅에 append
                setMessages((prev) =>
                  prev.some((message) => message.id === e.id)
                    ? prev
                    : [
                        ...prev,
                        {
                          id: e.id,
                          userId: e.sender.id,
                          username: e.sender.nickname,
                          userImage: e.sender.image,
                          message: e.message,
                          createdAt: e.createdAt,
                        },
                      ],
                );
                break;
              case 'room_closed':
                // {} - 방 닫힘. 종료된 방에는 다시 붙을 수 없으므로 재연결도 멈춥니다.
                setIsRoomClosed(true);
                stompClient.deactivate();
                break;
            }
          },
        );

        // 재연결이라면 끊겨 있는 동안 오간 채팅을 놓쳤으므로 기록을 다시 받아옵니다.
        if (hasConnectedRef.current) {
          queryClient.invalidateQueries({
            queryKey: chatMessagesQueryKey(playroomId),
          });
        }

        hasConnectedRef.current = true;
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [playroomId, queryClient]);

  // 채팅 보내기
  const sendMessage = (message: string) => {
    stompClientRef.current?.publish({
      destination: `/app/playrooms/${playroomId}/chat`,
      body: JSON.stringify({ message }),
    });
  };

  // 재생 컨트롤. 방장이 아니면 서버가 무시하므로 브로드캐스트되지 않습니다.
  const playbackControl = ({
    videoId,
    isPlaying,
    currentTime,
  }: {
    videoId: string;
    isPlaying: boolean;
    currentTime: number;
  }) => {
    // 연결이 끊긴 상태에서 publish 하면 예외가 나 방장의 조작 자체가 중단됩니다.
    // 재생은 로컬에서 계속되어야 하므로, 여기서는 알리는 것만 포기합니다.
    if (!stompClientRef.current?.connected) {
      console.warn('[playroom] 연결이 끊겨 재생 상태를 전달하지 못했습니다.');
      return;
    }

    stompClientRef.current.publish({
      destination: `/app/playrooms/${playroomId}/playback`,
      body: JSON.stringify({ videoId, isPlaying, currentTime }),
    });
  };

  return {
    messages,
    sendMessage,
    playback,
    playbackControl,
    memberJoinedCount,
    isRoomClosed,
  };
}
