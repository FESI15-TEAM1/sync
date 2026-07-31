import { useEffect } from 'react';

import { useUserStore } from '@/providers/user-store-provider';
import { getMe } from '@/services/user/user.api';
import type { MeResponse } from '@/services/user/user.types';

// Header의 최초 마운트 조회와 로그인 직후 갱신이 서로 다른 시점에 끝날 수 있어
// 나중에 "시작된" 요청만 스토어에 반영되도록 순번으로 최신 여부를 판단합니다.
let latestRequestId = 0;

export async function refreshCurrentUser(
  setUser: (user: MeResponse | null) => void,
) {
  const requestId = ++latestRequestId;

  try {
    const user = await getMe();
    if (requestId === latestRequestId) setUser(user);
    return user;
  } catch {
    if (requestId === latestRequestId) setUser(null);
    return null;
  }
}

// 로그인 응답으로 이미 유저 정보를 받은 경우, 재조회 없이 즉시 반영하면서
// 그보다 먼저 시작된 조회(refreshCurrentUser)가 뒤늦게 null로 덮어쓰지 못하게 막습니다.
export function commitUser(
  setUser: (user: MeResponse | null) => void,
  user: MeResponse,
) {
  latestRequestId += 1;
  setUser(user);
}

export function useCurrentUser() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    refreshCurrentUser(setUser);
  }, [setUser]);

  return user;
}
