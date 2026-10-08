import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'warm',
  label: 'Warm',
  vars: {
    '--ppx-bg': '#fdf8f5',
    '--ppx-fg': '#2d2424',
    '--ppx-muted': '#786c6c',
    '--ppx-accent': '#e05a47',
    '--ppx-border': '#ebdcd5',
    '--ppx-radius': '12px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, sans-serif)',
    '--ppx-font-body': 'var(--ppx-font-family-body, sans-serif)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
