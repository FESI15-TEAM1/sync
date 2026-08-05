'use client';

import { useQuery } from '@tanstack/react-query';
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

  const { data: me, isPending } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  });

  useEffect(() => {
    const userStore = store.getState();

    userStore.setLoading(isPending);

    if (!isPending) {
      userStore.setUser(me ?? null);
    }
  }, [store, isPending, me]);

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
