// src/providers/sidebar-store-provider.tsx
'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { useStore } from 'zustand';

import type { SidebarStore } from '@/stores/sidebar-store';
import { createSideBarStore } from '@/stores/sidebar-store';

export type SidebarStoreApi = ReturnType<typeof createSideBarStore>;

export const SidebarStoreContext = createContext<SidebarStoreApi | undefined>(
  undefined,
);

export interface SidebarStoreProviderProps {
  children: ReactNode;
}

export const SidebarStoreProvider = ({
  children,
}: SidebarStoreProviderProps) => {
  const [store] = useState(() => createSideBarStore());
  return (
    <SidebarStoreContext.Provider value={store}>
      {children}
    </SidebarStoreContext.Provider>
  );
};

export const useSidebarStore = <T,>(
  selector: (store: SidebarStore) => T,
): T => {
  const context = useContext(SidebarStoreContext);
  if (!context) {
    throw new Error('useSidebarStore must be used within SidebarStoreProvider');
  }

  return useStore(context, selector);
};
