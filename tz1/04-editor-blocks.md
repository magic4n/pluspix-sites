# PlusPix — Editor blocks

23 blocks. All render semantic HTML + CSS variables from the active site theme.
No Tailwind in site output. Icons: inline SVG only.

## Block list

| # | Block | Key props |
|---|---|---|
| 1 | Hero | title, subtitle, bgImage, ctaLabel, ctaHref, align |
| 2 | Section | padding, bg variant, slot children |
| 3 | Columns | count (2/3/4), gap, slot children per column |
| 4 | Heading | level (h1–h6), text, size (sm/md/lg/xl), align |
| 5 | RichText | content (sanitized HTML) |
| 6 | Image | src, alt, caption, rounded (bool), width (auto/sm/md/lg/full) |
| 7 | Gallery | images[], columns, gap, lightbox (bool) |
| 8 | VideoEmbed | provider (youtube/vimeo), url, aspect (16:9 default) |
| 9 | Button | label, href, variant (filled/outline/text), size, align |
| 10 | LinksList | items[{label, href, icon?}] |
| 11 | Navbar | logoText / logoImage, sticky (bool), pages auto-populated |
| 12 | Footer | copyright, links[], socials[] (inline SVG) |
| 13 | Divider | spacing, variant |
| 14 | Spacer | height (px scale) |
| 15 | Quote | text, author, variant |
| 16 | Card | image, title, body, linkHref, linkLabel |
| 17 | FeatureGrid | items[{icon, title, text}], columns (2/3/4) |
| 18 | Stats | items[{number, label}] |
| 19 | Testimonial | quote, avatar, name, role |
| 20 | FAQ / Accordion | items[{q, a}] — uses `<details>`/`<summary>`, no JS |
| 21 | CodeBlock | code, language?, showLanguageLabel (bool) |
| 22 | MapEmbed | lat, lng (or address) → OpenStreetMap iframe |
| 23 | ContactInfo | address, email, phone, hours |

**Navbar** is the only block that reads project context (page tree) at render
time. All other blocks are pure functions of their props.

## Per-block file contract

Each block file (`editor/puck/blocks/<Name>.tsx`) exports:

```ts
export default function BlockName(props: BlockNameProps) { ... }
export const fields: Fields<BlockNameProps> = { ... };
export const defaultProps: BlockNameProps = { ... };

Props must be minimal. Colors, spacing, radius come from site theme variables,
not from raw color pickers. Expose semantic options only:
ts

variant: 'primary' | 'muted' | 'accent'
size:    'sm' | 'md' | 'lg'
align:   'left' | 'center' | 'right'

Never expose raw hex color pickers in block props. If a block needs a color,
expose a variant that maps to a CSS variable.

Site themes (NOT Material)

Each theme file (site/themes/<id>.ts) exports:
ts

export default {
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
    '--ppx-font-heading': 'var(--ppx-font-family-heading)',
    '--ppx-font-body':    'var(--ppx-font-family-body)',
    '--ppx-font-mono':    'var(--ppx-font-family-mono)',
  },
  css?: string,  // optional extra CSS appended to styles.css
};

Ship 8 themes: minimal-light, minimal-dark, editorial, brutalist,
warm, forest, mono, pastel.
Google Fonts

site/fonts.ts — 20–25 curated pairs:
ts

export interface FontPair {
  id: string;
  name: string;                      // "Inter + Playfair Display"
  heading: string;                   // "Playfair Display"
  body: string;                      // "Inter"
  mono: string;                      // "JetBrains Mono"
  googleFamilies: string[];          // for the <link> href
}

export const FONT_PAIRS: FontPair[] = [ /* 20–25 entries */ ];

Per project, user picks one pair. Preview and export inject a <link> to
Google Fonts with only the chosen pair's families.
Puck config

editor/puck/config.tsx — one shared Config for all pages.

Sidebar categories map 1:1 to the block list:

    Layout: Section, Columns, Divider, Spacer

    Content: Hero, Heading, RichText, Quote, Card, FAQ

    Media: Image, Gallery, VideoEmbed, MapEmbed, CodeBlock

    Navigation: Navbar, Footer, LinksList, Button

    Data: Stats, FeatureGrid, Testimonial, ContactInfo

Custom Puck fields in editor/puck/fields/:

    AssetPicker — pick from project assets, or paste external URL.

    LinkPicker — internal (page id) OR external (URL).

    IconPicker — curated set of inline SVG icons.

Sanitization

RichText and CodeBlock accept user content. Sanitize with a small existing
library (e.g. dompurify) OR render as text-only in MVP. Never inject raw
HTML from user input into the DOM without sanitization.