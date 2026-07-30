import { createStore } from 'zustand/vanilla';

import { type PlaylistTrack } from '@/types/playlist';

export interface CurrentTrack extends PlaylistTrack {
  id?: number;
}

export type PlayerState = {
  currentTrack: CurrentTrack | null;
  isPlaying: boolean;
};

export type PlayerAction = {
  playTrack: (track: CurrentTrack) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  stop: () => void;
};

export type PlayerStore = PlayerState & PlayerAction;

export const defaultPlayerState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
};

export const createPlayerStore = (
  initState: PlayerState = defaultPlayerState,
) => {
  return createStore<PlayerStore>()((set) => ({
    ...initState,
    playTrack: (track) => set({ currentTrack: track, isPlaying: true }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    stop: () => set({ currentTrack: null, isPlaying: false }),
  }));
};
