import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'brutalist',
  label: 'Brutalist',
  vars: {
    '--ppx-bg': '#ffffff',
    '--ppx-fg': '#000000',
    '--ppx-muted': '#555555',
    '--ppx-accent': '#ffde03',
    '--ppx-border': '#000000',
    '--ppx-radius': '0px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, sans-serif)',
    '--ppx-font-body': 'var(--ppx-font-family-body, sans-serif)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
