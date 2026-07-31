import { createStore } from 'zustand/vanilla';

import type { MeResponse } from '@/services/user/user.types';

export type UserState = {
  user: MeResponse | null;
};

export type UserAction = {
  setUser: (user: MeResponse | null) => void;
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
