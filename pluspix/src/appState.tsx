/**
 * Minimal app-level screen state for M1.
 * Replaced by the full zustand project store in M2/M3 — kept as a tiny
 * React context so the two screens can switch without a router.
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type Screen = 'home' | 'editor';

interface AppState {
  screen: Screen;
  goToHome: () => void;
  openEditor: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('home');
  const value = useMemo<AppState>(
    () => ({
      screen,
      goToHome: () => setScreen('home'),
      openEditor: () => setScreen('editor'),
    }),
    [screen],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
