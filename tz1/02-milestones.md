
---

# 📄 tz1/02-milestones.md

```markdown
# PlusPix — Milestones

Deliver in order. Do NOT start the next milestone without explicit user command
("go M2", "next", "continue"). Each milestone's acceptance criteria must all
pass before reporting DONE.

---

## M1 — Scaffolding

**Goal:** project boots, M3 theme applied, i18n wired, empty Home screen.

### Tasks
- Init Vite + React 18 + TS (strict) in `pluspix/`.
- Install exactly:
  `@mui/material @emotion/react @emotion/styled
   @material/material-color-utilities
   i18next react-i18next i18next-browser-languagedetector
   dexie dexie-react-hooks
   zustand
   @measured/puck
   @dnd-kit/core @dnd-kit/sortable
   nanoid jszip file-saver`
- `tsconfig.json`: `strict: true`, path alias `@/*` → `src/*`.
- `vite.config.ts`: resolve alias `@` → `src`.
- `theme/m3.ts`: `themeFromSourceColor` → light + dark palettes → MUI `createTheme`.
- `theme/seedStore.ts`: seed color persisted in `localStorage` under `settings.seedColor`.
- `i18n/index.ts` + `i18n/en.json` + `i18n/ru.json` with shell strings
  (`app.title`, `topbar.save`, `topbar.preview`, `topbar.export`, `topbar.settings`,
  `home.empty.title`, `home.empty.cta`).
- `App.tsx`: two-screen switcher (Home | Editor placeholders).
- `home/HomeScreen.tsx`: MUI AppBar + empty state SVG + CTA button.
- `editor/EditorScreen.tsx`: placeholder.
- TopBar controls: language toggle (EN/RU), mode toggle (auto/light/dark),
  seed color picker (MUI color input).

### Acceptance
- `npm run dev` boots with zero console errors.
- `npm run build` → exit 0, 0 TS errors.
- Switching language updates all visible strings (no leftovers).
- Changing seed color updates the whole builder UI instantly; persists on reload.
- Mode toggle works in all three states (auto / light / dark).

---

## M2 — Projects (IndexedDB)

**Goal:** create, list, open, delete projects, fully persisted.

### Tasks
- `db/schema.ts`: Dexie schema per `01-architecture.md`.
- `db/api.ts`: typed CRUD for `projects`, `pages`, `assets`, `settings`.
  JSDoc on exported functions.
- `project/types.ts`: interfaces.
- `project/store.ts`: zustand store (current project, screen, UI flags).
- `home/HomeScreen.tsx`: Figma-like grid of `ProjectCard`s.
- `home/ProjectCard.tsx`: name, "last edited X ago", kebab icon, right-click menu.
- Context menu actions: Rename, Duplicate, Delete, Export (stub for now).
- "+ New project" as a large dashed tile → dialog with name input.
- Empty state (no projects) with illustration + one CTA.
- Opening a project → `EditorScreen` placeholder showing project name in TopBar.

### Acceptance
- Create → appears in grid immediately.
- Reload page → project still there.
- Rename inline works.
- Duplicate copies pages + theme + assets.
- Delete asks for confirmation.
- Open navigates to Editor placeholder with correct name.

---

## M3 — Page tree + persistence

**Goal:** full page CRUD, drag reorder, nest, per-page settings.

### Tasks
- `project/pageTree.ts`: pure operations on `pages` + `rootPageIds`:
  `addPage`, `renamePage`, `movePage`, `nestPage`, `deletePage`,
  `deleteSubtree`, `promoteChildren`.
- `editor/PageTree.tsx`: hierarchical list, expand/collapse.
  - dnd-kit sortable for sibling reorder.
  - dnd-kit droppable for nesting.
- Inline rename on double-click.
- Delete: if page has children → dialog with two options:
  "delete subtree" / "promote children".
- `editor/PageSettingsPanel.tsx`: slug (`[a-z0-9-]` validated), title,
  meta description. Live preview of resulting path.
- Autosave to Dexie debounced 500 ms + manual Save button in TopBar.
- `shared/slug.ts`: `slugify(input): string` + `isValidSlug(s): boolean`.

### Acceptance
- Add / rename / move / nest / delete pages. Arbitrary depth works.
- Autosave: close tab, reopen, project is in the same state.
- Slug validation shows error on bad input; strips invalid chars.
- Deleting a parent with children shows the choice dialog.

---

## M4 — Puck integration

**Goal:** edit each page's content via Puck, 23 blocks, undo/redo.

### Tasks
- `editor/puck/config.tsx`: Puck `Config` with 23 blocks (see `04-editor-blocks.md`).
- Each block in `editor/puck/blocks/<BlockName>.tsx`.
- Custom Puck fields in `editor/puck/fields/`: AssetPicker, LinkPicker
  (internal page + external URL), IconPicker (curated inline SVG set).
- Puck editor in center column; Puck field panel on right.
- Switching page swaps `puckData` (via store).
- Autosave to Dexie on Puck `onChange`, debounced 500 ms.
- Undo/redo:
  - Use Puck's built-in history if available in installed version.
  - Otherwise: zustand snapshot stack per page, cap 100 entries.
  - Shortcuts: `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, `Ctrl+Y`.
- `Navbar` block reads current page tree from React context and renders links
  to root-level pages.

### Acceptance
- All 23 blocks render in editor and produce sane HTML in preview.
- Edit → autosaved → reload → state preserved.
- Undo/redo works with correct per-page scope.
- Navbar auto-lists root pages; updates immediately when tree changes.

---

## M5 — Site themes + fonts

**Goal:** pick theme + font pair per project, live in editor canvas.

### Tasks
- `site/themes/*.ts`: 8 themes, each exports CSS variables + optional block
  overrides (see `04-editor-blocks.md`).
- `site/fonts.ts`: 20–25 curated Google Font pairs.
- `site/applyTheme.ts`: theme → CSS variables string, injectable into
  editor canvas + export.
- `editor/SiteThemePanel.tsx`: theme picker (8 cards with mini preview) +
  font pair picker (list with preview line).
- Theme change reflects in Puck canvas immediately, no reload.

### Acceptance
- All 8 themes visually distinct.
- Changing theme updates editor canvas; builder chrome colors unchanged.
- Font pair applies heading / body / mono correctly in preview.

---

## M6 — Preview

**Goal:** preview single page or whole site in new tab.

### Tasks
- `preview/previewBuilder.ts`:
  - input: `Project`, `Page | 'all'`.
  - output: HTML string.
  - Assets inlined: small (<50 KB) → base64; large → `URL.createObjectURL(blob)`.
    Object URLs are valid only inside the preview tab; never leak into export.
  - Inject theme CSS inline via `applyTheme` + Google Fonts `<link>`.
  - Internal links (root ↔ subpages) use query/hash routing inside preview HTML,
    NOT file paths (blob URLs have no paths).
- TopBar Preview menu: "Preview this page" / "Preview whole site".
- Opens as `blob:text/html` in new tab. No save required.

### Acceptance
- Preview matches editor canvas visually.
- Internal navigation works in preview.
- No `blob:` or `data:` leaks into exported HTML (only preview uses them).

---

## M7 — Export

**Goal:** ZIP export, opens offline.

### Tasks
- `export/renderPage.ts`: Puck Data → HTML string.
- `export/renderSite.ts`: all pages + `assets/css/styles.css` + assets.
- `export/buildZip.ts`: jszip structure per `05-export-import.md`.
- `export/downloadZip.ts`: file-saver.
- `export/manifest.ts`: builds `.pluspix/manifest.json`.
- Progress dialog listing pages being rendered.
- Include `.pluspix/manifest.json` for future import.

### Acceptance
- Export a 3-page site → ZIP → unzip → double-click `index.html` → renders
  exactly as preview, offline.
- No absolute paths, no `blob:`, no `data:` in exported HTML.
- Assets render correctly from relative paths.
- Google Fonts load if online; site still usable if offline.

---

## M8 — Import

**Goal:** re-import a previously exported PlusPix ZIP.

### Tasks
- Home screen → Import button.
- `export/importZip.ts`: read `.pluspix/manifest.json`, reconstruct
  project/pages/assets.
- Without manifest → unpack HTML as assets under a new "Imported" project,
  no structure.
- Validation (manifest schema, referenced assets exist) + error dialog.

### Acceptance
- Export → Import round-trips project (structure, theme, fonts, assets).
- Bad ZIP → friendly error, no crash.

---

## M9 — Polish

**Goal:** shippable MVP.

### Tasks
- Empty states, Snackbar toasts, keyboard shortcut list dialog.
- Focus management, aria labels.
- `README.md`: screenshots + how to run + how to export.
- `LICENSE` (MIT).
- Final pass: no `console.log`, no `TODO`, no unused imports.

### Acceptance
- Runs offline after first load (except Google Fonts).
- No network requests except Google Fonts.
- Full flow works in both Chromium and Firefox.
- All M1–M8 acceptance criteria still pass.