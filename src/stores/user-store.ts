import { createStore } from 'zustand/vanilla';

import type { SessionUser } from '@/services/user/user.types';

export type UserState = {
  user: SessionUser | null;
};

export type UserAction = {
  setUser: (user: SessionUser | null) => void;
};

export type UserStore = UserState & UserAction;

export const defaultUserState: UserState = {
  user: null,
};

export const createUserStore = (initState: UserState = defaultUserState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    setUser: (user) => set({ user }),
  }));
};
