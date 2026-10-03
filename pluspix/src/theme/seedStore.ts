/**
 * Persisted user preferences for the builder UI chrome (Material You).
 * Everything lives in localStorage under stable keys defined in the spec:
 *   settings.lang / settings.seedColor / settings.mode
 */

export const SEED_STORAGE_KEY = 'settings.seedColor';
export const MODE_STORAGE_KEY = 'settings.mode';

/** Default seed: Material baseline purple. */
export const DEFAULT_SEED_COLOR = '#6750A4';

export type ThemeMode = 'auto' | 'light' | 'dark';

export function loadSeedColor(): string {
  const raw = localStorage.getItem(SEED_STORAGE_KEY);
  if (raw && /^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toUpperCase();
  return DEFAULT_SEED_COLOR;
}

export function saveSeedColor(hex: string): void {
  localStorage.setItem(SEED_STORAGE_KEY, hex.toUpperCase());
}

export function loadThemeMode(): ThemeMode {
  const raw = localStorage.getItem(MODE_STORAGE_KEY);
  return raw === 'light' || raw === 'dark' || raw === 'auto' ? raw : 'auto';
}

export function saveThemeMode(mode: ThemeMode): void {
  localStorage.setItem(MODE_STORAGE_KEY, mode);
}

/** Resolve "auto" against the current OS preference. */
export function resolveMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'auto') return mode;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
