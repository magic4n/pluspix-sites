import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'pastel',
  label: 'Pastel',
  vars: {
    '--ppx-bg': '#fcf8ff',
    '--ppx-fg': '#2c2538',
    '--ppx-muted': '#786e88',
    '--ppx-accent': '#7c4dff',
    '--ppx-border': '#eedffb',
    '--ppx-radius': '16px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, sans-serif)',
    '--ppx-font-body': 'var(--ppx-font-family-body, sans-serif)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
