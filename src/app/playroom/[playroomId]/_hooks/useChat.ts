import { Client, type IMessage } from '@stomp/stompjs';
import { useEffect, useRef, useState } from 'react';

import type { ChatMessage } from '@/app/playroom/[playroomId]/playroom';

export function useChat(playroomId: number) {
  // 최신 메시지가 배열 앞에 옵니다. (채팅 목록이 flex-col-reverse 라서 아래쪽에 표시됨)
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: process.env.NEXT_PUBLIC_WS_URL,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe(
          `/sub/playroom/${playroomId}`,
          (frame: IMessage) => {
            setMessages((prev) => [
              JSON.parse(frame.body) as ChatMessage,
              ...prev,
            ]);
          },
        );
      },
    });

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      clientRef.current = null;
      void stompClient.deactivate();
    };
  }, [playroomId]);

  const sendMessage = (message: string) => {
    clientRef.current?.publish({
      destination: `/pub/playroom/${playroomId}/chat`,
      body: JSON.stringify({ message }),
    });
  };

  return { messages, sendMessage };
}
