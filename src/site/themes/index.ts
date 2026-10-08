import { SiteThemeDefinition } from './types';
import minimalLight from './minimal-light';
import minimalDark from './minimal-dark';
import editorial from './editorial';
import brutalist from './brutalist';
import warm from './warm';
import forest from './forest';
import mono from './mono';
import pastel from './pastel';

export * from './types';

export const THEMES: Record<string, SiteThemeDefinition> = {
  'minimal-light': minimalLight,
  'minimal-dark': minimalDark,
  editorial: editorial,
  brutalist: brutalist,
  warm: warm,
  forest: forest,
  mono: mono,
  pastel: pastel,
};

export const THEME_LIST = Object.values(THEMES);

export const DEFAULT_THEME_ID = 'minimal-light';
