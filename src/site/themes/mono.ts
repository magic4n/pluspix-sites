import { SiteThemeDefinition } from './types';

const theme: SiteThemeDefinition = {
  id: 'mono',
  label: 'Mono',
  vars: {
    '--ppx-bg': '#ffffff',
    '--ppx-fg': '#111111',
    '--ppx-muted': '#777777',
    '--ppx-accent': '#000000',
    '--ppx-border': '#d0d0d0',
    '--ppx-radius': '2px',
    '--ppx-space-unit': '8px',
    '--ppx-font-heading': 'var(--ppx-font-family-heading, monospace)',
    '--ppx-font-body': 'var(--ppx-font-family-body, monospace)',
    '--ppx-font-mono': 'var(--ppx-font-family-mono, monospace)',
  },
};

export default theme;
