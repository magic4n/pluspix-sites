import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSeedStore } from '@/theme/seedStore';
import { useProjectStore } from '@/project/store';
import { createM3Theme } from '@/theme/m3';
import { HomeScreen } from '@/home/HomeScreen';
import { EditorScreen } from '@/editor/EditorScreen';
import { LanguageSelectionDialog } from '@/shared/LanguageSelectionDialog';

export const App: React.FC = () => {
  const { screen } = useProjectStore();
  const { seedColor, mode } = useSeedStore();

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = mode === 'auto' ? systemPrefersDark : mode === 'dark';

  const theme = useMemo(() => {
    return createM3Theme(seedColor, isDark);
  }, [seedColor, isDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {screen === 'home' ? <HomeScreen /> : <EditorScreen />}
      <LanguageSelectionDialog />
    </ThemeProvider>
  );
};

export default App;
