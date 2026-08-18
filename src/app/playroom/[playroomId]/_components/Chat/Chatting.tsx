import { type SubmitEvent, useRef } from 'react';

import SendIcon from '@/assets/icons/chat/send.svg';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { PLAYROOM_CHAT_MAX_LENGTH } from '@/constants/playroom';

import { useChatScroll } from '../../_hooks/Chat/useChatScroll';
import { type ChatKindTypes } from '../Playroom';
import ChatMessage from './ChatMessage';
import SystemNotice from './SystemNotice';

export default function Chatting({
  messages,
  historyErrorMessage,
  chat,
  setChat,
  handleSubmit,
  hostId,
}: {
  messages: ChatKindTypes[];
  // 지난 채팅을 불러오지 못한 경우의 안내. 실시간 채팅은 그대로 동작합니다.
  historyErrorMessage?: string | null;
  chat: string;
  setChat: (chat: string) => void;
  handleSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  hostId: number | null;
}) {
  const chatLogRef = useRef<HTMLDivElement>(null);
  const { isScrolledUp, scrollToBottom } = useChatScroll(chatLogRef);

  return (
    <div className="scrollbar-track-bg-card scrollbar-thumb-text-secondary grid min-h-0 grid-rows-[1fr_auto]">
      {/* 채팅 로그 */}
      <div className="relative min-h-0">
        <div
          ref={chatLogRef}
          className="flex h-full flex-col-reverse overflow-y-auto px-4 py-2"
        >
          <div className="flex h-max flex-col gap-2">
            {historyErrorMessage && (
              <p role="alert" className="py-2 text-center text-xs text-red-500">
                {historyErrorMessage}
              </p>
            )}
            {messages.map((message) =>
              message.kind === 'chat' ? (
                <ChatMessage
                  key={`chat-${message.id}`}
                  username={message.username}
                  userImage={message.userImage}
                  message={message.message}
                  isHostMessage={message.userId === hostId}
                />
              ) : (
                <SystemNotice
                  key={message.key}
                  notice={message}
                  isHost={message.userId === hostId}
                />
              ),
            )}
          </div>
        </div>
        {/* 최신 채팅으로 이동 */}
        {isScrolledUp && (
          <Button
            type="button"
            onClick={scrollToBottom}
            variant="secondary"
            className="border-border bg-bg-card text-text-secondary hover:text-text-primary absolute bottom-3 left-1/2 z-3 -translate-x-1/2 border text-sm font-normal shadow-md"
          >
            최근 채팅으로 이동
          </Button>
        )}
      </div>
      {/* 채팅 입력 인풋 */}
      <form
        onSubmit={handleSubmit}
        className="border-border bg-bg-card flex items-center gap-2 border-t px-4 py-2"
      >
        <input
          type="text"
          value={chat}
          onChange={(event) => setChat(event.target.value)}
          className="border-border bg-input text-text-primary placeholder:text-text-secondary outline-primary flex w-full justify-between gap-2 rounded-full border px-4 py-3 text-sm shadow-none focus:outline-2"
          placeholder="채팅 입력"
          maxLength={PLAYROOM_CHAT_MAX_LENGTH}
        />
        <IconButton
          variants="primary"
          size="lg"
          type="submit"
          className="shrink-0"
        >
          <SendIcon width={20} height={20} className="text-text-primary" />
        </IconButton>
      </form>
    </div>
  );
}
