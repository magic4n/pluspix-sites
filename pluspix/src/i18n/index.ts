import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import ru from './ru.json';

/** localStorage key for the persisted UI language (see settings spec). */
export const LANG_STORAGE_KEY = 'settings.lang';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const;

/**
 * Normalize a raw browser/locale storage value ("ru-RU", "en-US", …) to a
 * supported language code. Anything non-Russian falls back to English.
 */
export function normalizeLang(raw: string | null | undefined): 'en' | 'ru' {
  if (!raw) return 'en';
  const lower = raw.toLowerCase();
  return lower.startsWith('ru') ? 'ru' : 'en';
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  supportedLngs: ['en', 'ru'],
  // We store plain "en"/"ru"; the detector may hand us "ru-RU" etc.
  load: 'languageOnly',
  detection: {
    // Explicit localStorage key first, then browser language.
    order: ['localStorage', 'navigator'],
    lookupLocalStorage: LANG_STORAGE_KEY,
    caches: ['localStorage'],
  },
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

/** Switch the UI language and persist the choice. */
export function setLanguage(lang: 'en' | 'ru'): void {
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  void i18n.changeLanguage(lang);
}

export default i18n;
