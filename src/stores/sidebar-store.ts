// src/stores/counter-store.ts
import { createStore } from 'zustand/vanilla';

export type SidebarState = {
  isOpen: boolean;
};

export type SidebarAction = {
  toggle: () => void;
};

export type SidebarStore = SidebarState & SidebarAction;

export const defaultSidebarState: SidebarState = {
  isOpen: false,
};

export const createSideBarStore = (
  initState: SidebarState = defaultSidebarState,
) => {
  return createStore<SidebarStore>()((set) => ({
    ...initState,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  }));
};
