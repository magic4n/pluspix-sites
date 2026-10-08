import { SiteTheme } from '@/project/types';
import { THEMES, DEFAULT_THEME_ID } from './themes';
import { getFontPair, DEFAULT_FONT_PAIR_ID } from './fonts';

/**
 * Generates the Google Fonts <link> href for the chosen font pair.
 */
export function getGoogleFontsHref(fontPairId?: string): string {
  const fontPair = getFontPair(fontPairId || DEFAULT_FONT_PAIR_ID);
  const familiesQuery = fontPair.googleFamilies.map((fam) => `family=${fam}`).join('&');
  return `https://fonts.googleapis.com/css2?${familiesQuery}&display=swap`;
}

/**
 * Converts a SiteTheme and fontPairId into CSS variables declarations and optional custom CSS.
 * @param theme The SiteTheme object.
 * @param fontPairId The chosen font pair ID.
 * @returns Complete CSS string for injection or export into styles.css.
 */
export function applyTheme(theme?: SiteTheme, fontPairId?: string): string {
  const themeDef = THEMES[theme?.id || DEFAULT_THEME_ID] || THEMES[DEFAULT_THEME_ID];
  const fontPair = getFontPair(fontPairId || DEFAULT_FONT_PAIR_ID);

  const mergedVars: Record<string, string> = {
    ...themeDef.vars,
    '--ppx-font-family-heading': `"${fontPair.heading}", serif`,
    '--ppx-font-family-body': `"${fontPair.body}", sans-serif`,
    '--ppx-font-family-mono': `"${fontPair.mono}", monospace`,
    ...(theme?.customOverrides || {}),
  };

  const varDeclarations = Object.entries(mergedVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  let css = `:root {\n${varDeclarations}\n}\n`;

  // Apply default body styles inside site canvas
  css += `
body, ._ppx_canvas_ {
  background-color: var(--ppx-bg);
  color: var(--ppx-fg);
  font-family: var(--ppx-font-body);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

* {
  box-sizing: border-box;
}
`;

  if (themeDef.css) {
    css += `\n${themeDef.css}\n`;
  }

  return css;
}
