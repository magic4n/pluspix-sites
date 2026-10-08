import { create } from 'zustand';

export type ThemeMode = 'auto' | 'light' | 'dark';

export interface ThemeStoreState {
  seedColor: string;
  mode: ThemeMode;
  setSeedColor: (color: string) => void;
  setMode: (mode: ThemeMode) => void;
}

export const DEFAULT_SEED_COLOR = '#6750A4';
export const DEFAULT_THEME_MODE: ThemeMode = 'auto';

const getInitialSeedColor = (): string => {
  if (typeof window === 'undefined') return DEFAULT_SEED_COLOR;
  return localStorage.getItem('settings.seedColor') || DEFAULT_SEED_COLOR;
};

const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return DEFAULT_THEME_MODE;
  const stored = localStorage.getItem('settings.mode');
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return DEFAULT_THEME_MODE;
};

export const useSeedStore = create<ThemeStoreState>((set) => ({
  seedColor: getInitialSeedColor(),
  mode: getInitialMode(),
  setSeedColor: (seedColor: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settings.seedColor', seedColor);
    }
    set({ seedColor });
  },
  setMode: (mode: ThemeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settings.mode', mode);
    }
    set({ mode });
  },
}));
