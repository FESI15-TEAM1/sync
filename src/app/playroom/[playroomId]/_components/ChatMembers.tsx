'use client';

import { clsx } from 'clsx';
import { type SubmitEvent, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { type ChatMessage } from '../playroom';
import ChatBox from './ChatBox';
import Member from './Member';

export function TabButton({
  tabname,
  isActive,
  onClick,
}: {
  tabname: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const tabButtonStyles =
    'text-xs text-text-secondary hover:text-text-primary cursor-pointer transition-all duration-300 ease-in-out border-b-1 border-border py-2';
  const tabButtonActiveStyles =
    'font-bold text-text-primary border-b-2 border-primary';

  return (
    <div
      className={twMerge(
        `${tabButtonStyles} ${isActive ? tabButtonActiveStyles : ''}`,
      )}
      onClick={onClick}
    >
      {tabname}
    </div>
  );
}

export default function ChatMembers({
  messages,
  onSend,
}: {
  messages: ChatMessage[];
  onSend: (message: string) => void;
}) {
  const [currentTab, setCurrentTab] = useState<'chatting' | 'members'>(
    'chatting',
  );
  const [chat, setChat] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = chat.trim();
    if (!message) return;

    onSend(message);
    setChat('');
  };

  return (
    <div className="border-border bg-bg-card mt-4 rounded-xl border-1">
      {/* 탭 버튼 */}
      <div className="grid w-full grid-cols-2 text-center">
        <TabButton
          tabname="채팅"
          isActive={currentTab === 'chatting'}
          onClick={() => setCurrentTab('chatting')}
        />
        <TabButton
          tabname="멤버"
          isActive={currentTab === 'members'}
          onClick={() => setCurrentTab('members')}
        />
      </div>

      {/* 탭 내용 */}
      <div className="flex h-100 flex-col">
        {currentTab === 'chatting' ? (
          // 채팅 탭 내용
          <>
            {/* 채팅 로그 */}
            <div className="flex w-full flex-1 flex-col-reverse overflow-y-auto px-4 pb-2">
              <div className="flex h-max flex-col-reverse gap-2">
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
              className="border-border flex items-center gap-2 border-t-1 px-4 py-2"
            >
              <input
                type="text"
                value={chat}
                onChange={(event) => setChat(event.target.value)}
                className="border-border bg-input text-text-primary placeholder:text-text-secondary outline-primary flex w-full justify-between gap-2 rounded-full border-1 px-4 py-3 text-sm shadow-none focus:outline-2"
                placeholder="채팅 입력"
              />
              <button
                type="submit"
                className="bg-primary text-text-primary flex h-11 w-12 cursor-pointer items-center justify-center rounded-full text-base whitespace-nowrap"
              >
                &gt;
              </button>
            </form>
          </>
        ) : (
          // 멤버 탭 내용
          <>
            <div className="scrollbar-auto overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-4">
                <Member userId={1} username="깃이너무어려워요" />
                <Member userId={354} username="루시드코딩" />
                <Member userId={494} username="gitcommitall" />
                <Member userId={573} username="rmrf" />
                <Member userId={1383} username="프론트기수가많았다" />
                <Member userId={23} username="이탈자가많았다" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
