import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'minimal-light',
  label: 'Minimal Light',
  vars: {
    '--ppx-bg': '#ffffff',
    '--ppx-fg': '#111827',
    '--ppx-muted': '#6b7280',
    '--ppx-accent': '#3b82f6',
    '--ppx-border': '#e5e7eb',
    '--ppx-radius': '8px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, sans-serif)',
    '--ppx-font-body': 'var(--ppx-font-family-body, sans-serif)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
