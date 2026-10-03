import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppProvider, useApp } from './appState';
import { normalizeLang, setLanguage, LANG_STORAGE_KEY } from './i18n';
import { getM3Theme } from './theme/m3';
import {
  loadSeedColor,
  saveSeedColor,
  loadThemeMode,
  saveThemeMode,
  resolveMode,
  type ThemeMode,
} from './theme/seedStore';
import ThemePickerDialog from './home/ThemePickerDialog';
import HomeScreen from './home/HomeScreen';
import EditorScreen from './editor/EditorScreen';

/** Small shared hook bundling theme prefs + persistence. */
function useUiPrefs() {
  const [seed, setSeed] = useState<string>(() => loadSeedColor());
  const [modePref, setModePref] = useState<ThemeMode>(() => loadThemeMode());
  const [systemDark, setSystemDark] = useState<boolean>(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  // Track OS preference changes while in "auto" mode.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const mode = resolveMode(modePref);
  // systemDark participates so "auto" re-resolves on OS change.
  const theme = useMemo(
    () => getM3Theme(seed, modePref === 'auto' ? (systemDark ? 'dark' : 'light') : mode),
    [seed, mode, modePref, systemDark],
  );

  const changeSeed = (hex: string) => {
    saveSeedColor(hex);
    setSeed(hex);
  };
  const changeMode = (m: ThemeMode) => {
    saveThemeMode(m);
    setModePref(m);
  };

  return { seed, modePref, theme, changeSeed, changeMode };
}

function LangToggle() {
  const { t, i18n: inst } = useTranslation();
  const current = normalizeLang(inst.language);
  return (
    <button
      className="lang-toggle"
      onClick={() => setLanguage(current === 'en' ? 'ru' : 'en')}
      title={t('topbar.language')}
      aria-label={t('topbar.language')}
    >
      {current.toUpperCase()}
    </button>
  );
}

function Chrome() {
  const { screen } = useApp();
  // Subscribing hook: re-renders the chrome whenever the language changes.
  const { t, i18n: inst } = useTranslation();
  const { seed, modePref, theme, changeSeed, changeMode } = useUiPrefs();
  const [pickerOpen, setPickerOpen] = useState(false);

  // Reflect persisted lang key even if detector resolved a region variant.
  useEffect(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && normalizeLang(stored) !== normalizeLang(inst.language)) {
      setLanguage(normalizeLang(stored));
    }
  }, []);

  return (
    <div className={`app-root mui-theme-${theme.palette.mode}`} data-seed={seed}>
      <header className="topbar">
        <div className="topbar-left">
          <span className="logo material-symbols-outlined">grid_goldbooks</span>
          <span className="app-name">{t('app.name')}</span>
          <span className="app-tagline">{t('app.tagline')}</span>
        </div>
        <div className="topbar-right">
          <LangToggle />
          <button
            className="icon-btn"
            onClick={() =>
              changeMode(
                modePref === 'auto' ? 'light' : modePref === 'light' ? 'dark' : 'auto',
              )
            }
            title={`${t('topbar.themeMode')}: ${
              modePref === 'auto'
                ? t('topbar.modeAuto')
                : modePref === 'light'
                  ? t('topbar.modeLight')
                  : t('topbar.modeDark')
            }`}
            aria-label={t('topbar.themeMode')}
          >
            <span className="material-symbols-outlined">
              {modePref === 'auto' ? 'brightness_auto' : modePref === 'light' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button
            className="seed-swatch"
            style={{ background: seed }}
            onClick={() => setPickerOpen(true)}
            title={t('topbar.seedColor')}
            aria-label={t('topbar.seedColor')}
          />
        </div>
      </header>
      <main className="content">{screen === 'editor' ? <EditorScreen /> : <HomeScreen />}</main>
      <ThemePickerDialog
        open={pickerOpen}
        seed={seed}
        mode={modePref}
        onClose={() => setPickerOpen(false)}
        onSeedChange={changeSeed}
        onModeChange={changeMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Chrome />
    </AppProvider>
  );
}
