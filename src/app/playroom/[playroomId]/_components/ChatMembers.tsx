'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

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
  const tabButtonStyles = clsx(
    'text-xs text-text-secondary hover:text-text-primary cursor-pointer transition-all duration-300 ease-in-out border-b-1 border-border py-2',
  );
  const tabButtonActiveStyles = clsx(
    'font-bold text-text-primary border-b-2 border-primary',
  );

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

export default function ChatMembers() {
  const [currentTab, setCurrentTab] = useState<'chatting' | 'members'>(
    'chatting',
  );

  return (
    <div className="border-border bg-bg-card mt-4 rounded-xl border-1">
      {/* 탭 버튼 */}
      <div className="hover:text-text-primary grid w-full cursor-pointer grid-cols-2 text-center">
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
                <ChatBox username="울랄라" message="안녕하세요" />
                <ChatBox username="rlarhkdxor" message="안녕하세요~!" />
                <ChatBox username="옴니버스" message="좋은 하루 되셍!" />
                <ChatBox username="yeye" message="좋은 노래네요!" />
                <ChatBox username="holymoly" message="노래 링크 부탁들혀요" />
                <ChatBox username="dbsehdwn1" message="쒸엣" />
                <ChatBox username="나랏말싸미" message="김미김미" />
                <ChatBox
                  username="컨셉에사로잡혀"
                  message="power overwhelming"
                />
              </div>
            </div>
            {/* 채팅 입력 인풋 */}
            <div className="border-border flex items-center gap-2 border-t-1 px-4 py-2">
              <input
                type="text"
                className="border-border bg-input text-text-primary placeholder:text-text-secondary outline-primary flex w-full justify-between gap-2 rounded-full border-1 px-4 py-3 text-sm shadow-none focus:outline-2"
                placeholder="채팅 입력"
              />
              <button className="bg-primary text-text-primary flex h-11 w-12 cursor-pointer items-center justify-center rounded-full text-base whitespace-nowrap">
                &gt;
              </button>
            </div>
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
