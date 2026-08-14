'use client';

import { cva } from 'class-variance-authority';
import { type SubmitEvent, useState } from 'react';

import SyncLogo from '@/assets/icons/syncLogo.svg';

import { type ChatKindTypes } from '../Playroom';
import Chatting from './Chatting';
import type { MemberType } from './MemberItem';
import Members from './Members';

export function TabButton({
  tabname,
  isActive,
  onClick,
}: {
  tabname: string;
  isActive: boolean;
  onClick: () => void;
}) {
  // 탭 버튼 스타일
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
  hostId,
}: {
  messages: ChatKindTypes[];
  historyErrorMessage?: string | null;
  sendMessage: (message: string) => void;
  members: MemberType[];
  hostId: number | null;
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

  // 멤버 수 표시 패널 스타일
  const listenerPanelStyles = cva(
    'text-text-primary border-border absolute top-8.5 right-0 flex items-center gap-1 rounded-bl-xl border-b border-l px-2 py-1 text-center z-10 bg-bg-card',
    {
      variants: {
        currentTab: {
          chatting: '',
          members:
            'before:from-primary before:absolute before:top-0 before:-left-px before:block before:h-6 before:w-px before:bg-linear-to-b before:to-transparent before:content-[""]',
        },
      },
    },
  );

  return (
    <div className="border-border bg-bg-card relative grid h-full min-h-0 grid-rows-[auto_1fr] overflow-hidden rounded-xl border">
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

      {/* 현재 참여자 수 패널 */}
      <span className={listenerPanelStyles({ currentTab })}>
        <SyncLogo
          width={20}
          height={20}
          key={members.length}
          style={{
            animation: 'var(--animate-ping)',
            animationFillMode: 'both',
            animationDirection: 'alternate',
            animationDuration: '300ms',
            animationTimingFunction: 'ease-out',
            animationIterationCount: 2,
          }}
        />
        <span>{members.length}</span>
      </span>

      {/* 탭 내용 */}
      {currentTab === 'chatting' ? (
        // 채팅 탭 내용
        <Chatting
          messages={messages}
          historyErrorMessage={historyErrorMessage}
          chat={chat}
          setChat={setChat}
          handleSubmit={handleSubmit}
          hostId={hostId}
        />
      ) : (
        // 멤버 탭 내용
        <Members members={members} hostId={hostId} />
      )}
    </div>
  );
}
