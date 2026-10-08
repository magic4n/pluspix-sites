import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'forest',
  label: 'Forest',
  vars: {
    '--ppx-bg': '#f4f7f4',
    '--ppx-fg': '#1e382b',
    '--ppx-muted': '#5c7365',
    '--ppx-accent': '#2e7d32',
    '--ppx-border': '#d8e2d8',
    '--ppx-radius': '10px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, sans-serif)',
    '--ppx-font-body': 'var(--ppx-font-family-body, sans-serif)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
