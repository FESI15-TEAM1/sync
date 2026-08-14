import { Client, type IMessage } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { getAccessToken } from '@/services/auth/token.api';

import type {
  ChatMessageTypes,
  SystemNoticeTypes,
} from '../_components/Playroom';
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
  // 접속해 있는 동안의 입·퇴장 알림. 기록으로 남기지 않고 화면에만 보여줍니다.
  const [systemNotices, setSystemNotices] = useState<SystemNoticeTypes[]>([]);
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
  // 알림을 어느 채팅 뒤에 끼울지 정하는 기준. 접속 후 마지막으로 받은 채팅 id 입니다.
  const lastChatIdRef = useRef(0);
  const noticeSeqRef = useRef(0);

  useEffect(() => {
    // 입·퇴장 알림을 채팅 로그에 끼울 자리(마지막 채팅 뒤)를 붙여서 쌓아둡니다.
    const addNotice = (
      type: SystemNoticeTypes['type'],
      member: { userId: number; nickname: string } | undefined,
    ) => {
      if (!member) return;

      noticeSeqRef.current += 1;
      const seq = noticeSeqRef.current;

      setSystemNotices((prev) => [
        ...prev,
        {
          key: `notice-${seq}`,
          seq,
          afterMessageId: lastChatIdRef.current,
          type,
          // 접속해 있는 동안 나간 적이 있으면 재참여로 안내합니다.
          isRejoin:
            type === 'joined' &&
            prev.some(
              (notice) =>
                notice.type === 'left' && notice.userId === member.userId,
            ),
          userId: member.userId,
          nickname: member.nickname,
        },
      ]);
    };

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
        // 스냅샷을 우선 구독하고, 그 뒤에 방장 브로드캐스트를 구독해야 한다. 그래야 스냅샷이 늦게 도착해도 브로드캐스트가 먼저 와서 재생 상태가 꼬이는 일을 막는다.
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
              exact: true,
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
                addNotice('joined', e.member);
                // { member, listenerCount } - 참가자 목록과 인원수는 방 상세(REST)가 들고 있으므로
                // 여기서 따로 쌓지 않고 다시 받아오게 한다.
                queryClient.invalidateQueries({
                  queryKey: playroomQueryKey(playroomId),
                  exact: true,
                });
                break;
              case 'member_left':
                addNotice('left', e.member);
                queryClient.invalidateQueries({
                  queryKey: playroomQueryKey(playroomId),
                  exact: true,
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
                    exact: true,
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
                // 이후 도착하는 알림은 이 채팅 뒤에 놓입니다.
                lastChatIdRef.current = Math.max(lastChatIdRef.current, e.id);
                // 채팅 메시지 수신. 중복 수신 방지. 이미 받은 채팅이면 무시합니다.
                setMessages((prev) =>
                  prev.some((message) => message.id === e.id)
                    ? prev
                    : [
                        ...prev,
                        {
                          id: e.id,
                          userId: e.sender.userId,
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
    systemNotices,
    sendMessage,
    playback,
    playbackControl,
    memberJoinedCount,
    isRoomClosed,
  };
}
