'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

import type { PlayerStore } from '@/stores/player-store';
import { createPlayerStore } from '@/stores/player-store';

export type PlayerStoreApi = ReturnType<typeof createPlayerStore>; //

export const PlayerStoreContext = createContext<PlayerStoreApi | undefined>(
  undefined,
);

export interface PlayerStoreProviderProps {
  children: ReactNode;
}

export const PlayerStoreProvider = ({ children }: PlayerStoreProviderProps) => {
  const [store] = useState(() => createPlayerStore());
  return (
    <PlayerStoreContext.Provider value={store}>
      {children}
    </PlayerStoreContext.Provider>
  );
};

export const usePlayerStore = <T,>(selector: (store: PlayerStore) => T): T => {
  const context = useContext(PlayerStoreContext);
  if (!context) {
    throw new Error(
      'usePlayer 를 사용할려면 playerProvider안에서 사용해 야됩니다.',
    );
  }

  return useStore(context, selector);
};
