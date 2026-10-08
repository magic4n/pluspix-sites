# PlusPix — Architecture

## Mission

Open-source, **100% client-side**, multi-page, block-based website builder.
No backend. No accounts. No server. No cloud. Users build sites in the browser
and export a ready-to-host ZIP.

- **Builder UI** — Material You (M3), always.
- **Sites users create** — any style; the builder imposes nothing.

## Hard constraints

- No backend, no API, no auth, no server DB, no cloud storage, no telemetry.
- Persistence: **IndexedDB** via Dexie.
- Target browsers: **Chromium + Firefox**. Safari is not a target.
- Builder UI language: **English** (source of truth) + **Russian** (translation).
- Site output: plain static HTML + one shared `styles.css` + `assets/` folder.
- Exported sites open offline by double-clicking `index.html`. Relative paths
  only. No `blob:` or `data:` URLs in exported HTML.
- License: MIT.

## Stack

| Layer | Choice |
|---|---|
| Build | Vite + React 18 + TypeScript (strict) |
| Editor engine | `@measured/puck` (MIT) |
| Builder UI kit | MUI v6 + `@emotion/react` + `@emotion/styled` |
| M3 palettes | `@material/material-color-utilities` |
| Builder icons | Material Symbols (variable, official) |
| Persistence | `dexie` + `dexie-react-hooks` |
| Editor state | `zustand` (single store) |
| i18n | `i18next` + `react-i18next` + `i18next-browser-languagedetector` |
| Export | `jszip` + `file-saver` |
| HTML generation | `react-dom/server` browser build (`renderToStaticMarkup`) |
| Drag & drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| IDs | `nanoid` |

No router. Two screens (Home, Editor) switched by state.

## File structure
pluspix/
├── public/
│ └── favicon.svg
├── src/
│ ├── main.tsx
│ ├── App.tsx
│ ├── i18n/
│ │ ├── index.ts
│ │ ├── en.json
│ │ └── ru.json
│ ├── theme/
│ │ ├── m3.ts
│ │ └── seedStore.ts
│ ├── db/
│ │ ├── schema.ts
│ │ └── api.ts
│ ├── project/
│ │ ├── types.ts
│ │ ├── store.ts
│ │ └── pageTree.ts
│ ├── home/
│ │ ├── HomeScreen.tsx
│ │ └── ProjectCard.tsx
│ ├── editor/
│ │ ├── EditorScreen.tsx
│ │ ├── TopBar.tsx
│ │ ├── PageTree.tsx
│ │ ├── PageSettingsPanel.tsx
│ │ ├── SiteThemePanel.tsx
│ │ └── puck/
│ │ ├── config.tsx
│ │ ├── fields/
│ │ └── blocks/
│ ├── site/
│ │ ├── themes/
│ │ │ ├── minimal-light.ts
│ │ │ ├── minimal-dark.ts
│ │ │ ├── editorial.ts
│ │ │ ├── brutalist.ts
│ │ │ ├── warm.ts
│ │ │ ├── forest.ts
│ │ │ ├── mono.ts
│ │ │ └── pastel.ts
│ │ ├── fonts.ts
│ │ └── applyTheme.ts
│ ├── preview/
│ │ └── previewBuilder.ts
│ ├── export/
│ │ ├── renderPage.ts
│ │ ├── renderSite.ts
│ │ ├── buildZip.ts
│ │ ├── downloadZip.ts
│ │ ├── manifest.ts
│ │ └── importZip.ts
│ └── shared/
│ ├── slug.ts
│ ├── id.ts
│ └── useDebouncedEffect.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── ARCHITECTURE.md
├── MILESTONES.md
├── README.md
└── tz1/


## Data model (Dexie)

```ts
interface Project {
  id: string;                      // nanoid
  name: string;
  createdAt: number;
  updatedAt: number;
  theme: SiteTheme;
  pages: Record<string, Page>;     // flat map; tree from parentId + order
  rootPageIds: string[];           // ordered top-level page ids
  fontPairId: string;              // key from site/fonts.ts
}

interface Page {
  id: string;
  parentId: string | null;
  order: number;                   // sibling order
  slug: string;                    // path segment, [a-z0-9-]
  title: string;                   // <title> + nav label
  metaDescription?: string;
  puckData: PuckData;
  createdAt: number;
  updatedAt: number;
}

interface Asset {
  id: string;
  projectId: string;
  filename: string;                // e.g. "hero.jpg"
  mime: string;
  blob: Blob;
  createdAt: number;
}

interface SiteTheme {
  id: string;                      // matches a theme in site/themes/
  customOverrides?: Record<string, string>; // CSS vars
}

db.version(1).stores({
  projects: 'id, updatedAt',
  pages: 'id, projectId',
  assets: 'id, projectId',
  settings: 'key',                 // lang, seedColor, mode, lastOpenedProjectId
});
Path derivation:

    root page with slug === 'index' → index.html

    other pages → {slug}/index.html

    nested → {parent}/{child}/index.html

Accessibility

    All interactive elements keyboard-reachable.

    Visible M3 focus ring on focus.

    Exported pages have <title> and <meta name="description"> from Page settings.

    Exported HTML has <html lang="en"> (or per-page lang).

Global anti-patterns

    Do not add libraries the stack already covers.

    Do not create utils.ts grab-bags. Helpers live next to their domain.

    Do not hand-roll drag-and-drop — dnd-kit is in the stack.

    Do not write a Markdown renderer — use a small existing one if needed.

    Do not implement SSR, hydration, or a routing framework — SPA with two screens.

    Do not leak M3 tokens into site output.

    Do not translate code identifiers to Russian — only UI strings.

    Do not run npm install <pkg> without explicit user approval.

    Do not run destructive shell commands (rm -rf, git reset --hard,
    force push) without explicit confirmation.

