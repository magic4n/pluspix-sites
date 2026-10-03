import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './i18n';
import App from './App';
import { getM3Theme } from './theme/m3';
import { loadSeedColor, loadThemeMode, resolveMode } from './theme/seedStore';
import './index.css';

/**
 * Bootstrap: build the initial M3 theme synchronously so first paint is
 * already themed; App re-derives it reactively on seed/mode changes.
 */
const initialTheme = getM3Theme(
  loadSeedColor(),
  resolveMode(loadThemeMode()),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={initialTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
