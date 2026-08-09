import { type SubmitEvent } from 'react';

import SendIcon from '@/assets/icons/chat/send.svg';
import IconButton from '@/components/IconButton';

import { type ChatMessage } from '../Playroom';
import ChatBox from './ChatMessage';

export default function Chatting({
  messages,
  chat,
  setChat,
  handleSubmit,
}: {
  messages: ChatMessage[];
  chat: string;
  setChat: (chat: string) => void;
  handleSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="scrollbar-track-bg-card scrollbar-thumb-text-secondary grid min-h-0 grid-rows-[1fr_auto]">
      {/* 채팅 로그 */}
      <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto px-4 pb-2">
        <div className="flex h-max flex-col gap-2">
          {messages.map((message, index) => (
            <ChatBox
              key={index}
              username={message.username}
              message={message.message}
            />
          ))}
        </div>
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
        />
        <IconButton variants="primary" size="lg" type="submit">
          <SendIcon width={20} height={20} className="text-text-primary" />
        </IconButton>
      </form>
    </div>
  );
}
