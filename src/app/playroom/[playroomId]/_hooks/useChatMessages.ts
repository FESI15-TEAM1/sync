import { useQuery } from '@tanstack/react-query';

import { APIError } from '@/lib/http/error';
import { getPlayroomMessages } from '@/services/playroom/playroomMessage.api';
import type { PlayroomMessageResponse } from '@/services/playroom/playroomMessage.types';

import type { ChatMessageTypes } from '../_components/Playroom';

/** 방에 들어왔을 때 한 번에 불러올 지난 채팅 개수 */
const CHAT_HISTORY_LIMIT = 50;

export const chatMessagesQueryKey = (playroomId: number) =>
  ['playrooms', playroomId, 'messages'] as const;

export function toChatMessage(
  message: PlayroomMessageResponse,
): ChatMessageTypes {
  return {
    id: message.id,
    userId: message.sender.userId,
    username: message.sender.nickname,
    userImage: message.sender.image,
    message: message.message,
    createdAt: message.createdAt,
  };
}

/**
 * 지난 채팅(REST)과 접속 후 실시간으로 받은 채팅(WebSocket)을 하나의 목록으로 합칩니다.
 * 중간에 들어와도 이전 대화가 보이도록, 방 진입 시 기록을 한 번 받아오고 이후는 WS 이벤트로 이어붙입니다.
 */
export function useChatMessages(
  playroomId: number,
  liveMessages: ChatMessageTypes[],
) {
  const {
    data,
    error,
    isPending: isHistoryPending,
  } = useQuery({
    queryKey: chatMessagesQueryKey(playroomId),
    queryFn: () =>
      getPlayroomMessages(playroomId, { limit: CHAT_HISTORY_LIMIT }),
    // 실시간 메시지는 방을 벗어나면 사라지므로, 다시 들어올 때는 캐시를 쓰지 않고 항상 새로 받아옵니다.
    staleTime: 0,
    refetchOnMount: 'always',
    // 대신 머무는 동안의 변화는 WebSocket 이 담당하므로 포커스마다 다시 받지는 않습니다.
    refetchOnWindowFocus: false,
  });

  const historyMessages = (data?.items ?? []).map(toChatMessage);

  // 기록을 받아오는 사이 도착한 채팅이 기록에도 들어 있을 수 있어 id 로 걸러냅니다.
  const historyIds = new Set(historyMessages.map((message) => message.id));
  // 서버는 최신순으로 내려주므로, id(=저장 순서) 오름차순으로 정렬해 화면 순서를 맞춥니다.
  const messages = [
    ...historyMessages,
    ...liveMessages.filter((message) => !historyIds.has(message.id)),
  ].sort((a, b) => a.id - b.id);

  const errorMessage = error
    ? error instanceof APIError
      ? error.message
      : '이전 채팅을 가져오는 중 오류가 발생했습니다.'
    : null;

  return { messages, errorMessage, isHistoryPending };
}
