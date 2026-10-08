import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'minimal-dark',
  label: 'Minimal Dark',
  vars: {
    '--ppx-bg': '#0f172a',
    '--ppx-fg': '#f8fafc',
    '--ppx-muted': '#94a3b8',
    '--ppx-accent': '#38bdf8',
    '--ppx-border': '#334155',
    '--ppx-radius': '8px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, sans-serif)',
    '--ppx-font-body': 'var(--ppx-font-family-body, sans-serif)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
