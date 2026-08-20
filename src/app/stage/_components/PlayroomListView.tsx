'use client';

import { useState } from 'react';

import { useUserStore } from '@/providers/user-store-provider';

import LivePlayroomListView from './LivePlayroomListView';
import MyPlayroomListView from './MyPlayroomListView';
import MyPlayroomToggle from './MyPlayroomToggle';

export default function PlayroomListView() {
  const user = useUserStore((state) => state.user);

  const [isMineOnly, setIsMineOnly] = useState(false);

  // 내가 만든 플레이룸 조회는 회원 전용이라 비회원에게는 토글을 노출하지 않습니다.
  const isMyListVisible = Boolean(user) && isMineOnly;

  return (
    <div className="relative">
      {user && (
        <MyPlayroomToggle isMineOnly={isMineOnly} onChange={setIsMineOnly} />
      )}

      {isMyListVisible ? <MyPlayroomListView /> : <LivePlayroomListView />}
    </div>
  );
}
