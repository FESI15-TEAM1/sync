'use client';

import { cva } from 'class-variance-authority';
import { type SubmitEvent, useState } from 'react';

import { type ChatMessage } from '../Playroom';
import Chatting from './Chatting';
import type { MemberType } from './MemberItem';
import Members from './Members';

const tabButtonVariants = cva('box-border cursor-pointer py-2 text-xs', {
  variants: {
    isActive: {
      true: 'border-primary text-text-primary border-b-2 font-bold',
      false:
        'border-border text-text-secondary hover:text-text-primary border-b-1',
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

export function TabButton({
  tabname,
  isActive,
  onClick,
}: {
  tabname: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={tabButtonVariants({ isActive })}
      onClick={onClick}
    >
      {tabname}
    </button>
  );
}

export default function ChatMembers({
  messages,
  historyErrorMessage,
  sendMessage,
  members,
}: {
  messages: ChatMessage[];
  historyErrorMessage?: string | null;
  sendMessage: (message: string) => void;
  members: MemberType[];
}) {
  const [currentTab, setCurrentTab] = useState<'chatting' | 'members'>(
    'chatting',
  );
  const [chat, setChat] = useState('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = chat.trim();
    if (!message) return;

    try {
      sendMessage(message);
      setChat('');
    } catch (error) {
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
      console.error('메시지 전송 실패:', error);
    }
  };

  return (
    <div className="border-border bg-bg-card grid h-full min-h-0 grid-rows-[auto_1fr] overflow-hidden rounded-xl border">
      {/* 탭 버튼 */}
      <div className="grid grid-cols-2 text-center">
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
      {currentTab === 'chatting' ? (
        // 채팅 탭 내용
        <Chatting
          messages={messages}
          historyErrorMessage={historyErrorMessage}
          chat={chat}
          setChat={setChat}
          handleSubmit={handleSubmit}
        />
      ) : (
        // 멤버 탭 내용
        <Members members={members} />
      )}
    </div>
  );
}
