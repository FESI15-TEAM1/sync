'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';

import { getMe } from '@/services/user/user.api';
import type { UserStore } from '@/stores/user-store';
import { createUserStore } from '@/stores/user-store';

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined,
);

export interface UserStoreProviderProps {
  children: ReactNode;
}

export const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
  const [store] = useState(() => createUserStore());

  useEffect(() => {
    getMe()
      .then((me) =>
        store.setState({
          user: {
            id: me.id,
            nickname: me.nickname,
            image: me.image,
          },
        }),
      )
      .catch(() => {
        // 로그인이 먼저 끝나 유저가 채워졌다면 이 조회의 실패로 덮어쓰지 않는다.
        if (store.getState().user !== null) return;
        store.setState({ user: null });
      });
  }, [store]);

  return (
    <UserStoreContext.Provider value={store}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const context = useContext(UserStoreContext);
  if (!context) {
    throw new Error('useUserStore는 UserStoreProvider 안에 있어야 합니다.');
  }

  return useStore(context, selector);
};
