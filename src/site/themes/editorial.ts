import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'editorial',
  label: 'Editorial',
  vars: {
    '--ppx-bg': '#faf7f2',
    '--ppx-fg': '#1a1a1a',
    '--ppx-muted': '#6b6b6b',
    '--ppx-accent': '#c2410c',
    '--ppx-border': '#e5e0d8',
    '--ppx-radius': '4px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, serif)',
    '--ppx-font-body': 'var(--ppx-font-family-body, serif)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
