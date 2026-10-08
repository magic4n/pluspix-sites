# PlusPix — Frontend (builder UI)

## Screens

Two screens, single zustand store, switched by state (no router).

### HomeScreen

- Figma-like grid of project cards (responsive).
- Card: name, "last edited X ago", kebab icon (also right-click).
- Context menu: Rename, Duplicate, Export, Delete.
- "+ New project" = large dashed tile.
- Empty state: SVG illustration + one CTA.
- Import ZIP button (M8).

### EditorScreen

Three columns + top bar.
┌───────────────────────────────────────────────────────────────────┐
│ TopBar: logo · project name · Save · Preview · Export · ⚙ · 🌐 · │
├─────────────┬─────────────────────────────────────┬───────────────┤
│ PageTree │ Puck editor (center) │ Puck fields │
└─────────────┴─────────────────────────────────────┴───────────────┘

## TopBar

Left to right:
- **Logo** — click → Home (confirm unsaved).
- **Project name** — inline editable.
- **Save** — flush autosave, update `updatedAt`.
- **Preview** — dropdown: "Preview this page" / "Preview whole site".
- **Export** — opens export dialog (M7).
- **Settings** (gear) — drawer with M3 seed color, mode, language.
- **Language toggle** — EN / RU.

## PageTree (left sidebar)

- Hierarchical list, expandable/collapsible.
- Add page: root level, or child of selected page.
- Rename inline (double-click).
- Slug edited in PageSettingsPanel (not inline).
- Drag to reorder siblings (dnd-kit sortable).
- Drag to nest under another page (dnd-kit droppable).
- Delete: if has children → dialog "delete subtree" / "promote children".
- Active page highlighted with M3 secondary container color.
- Top of tree: "Site theme" + "Page settings" toggle buttons.

## PageSettingsPanel

Drawer or modal from right:
- Slug field: validated `[a-z0-9-]`, live preview of resulting path.
- Title field.
- Meta description.
- Reserved for later: per-page lang override.

## SiteThemePanel

- Theme picker: 8 cards with mini swatch preview.
- Font pair picker: 20–25 options, each with a preview line.
- Changing theme applies to editor canvas immediately.

## Material You (builder only)

- Seed color from user, default: nice Material purple.
- `themeFromSourceColor` → full light + dark palettes → MUI theme
  (`primary`, `secondary`, `tertiary`, `surface`, `onSurface`, `error`, `outline`).
- MUI components: `AppBar`, `Drawer`, `IconButton`, `Menu`, `Dialog`,
  `TextField`, `Select`, `Tabs`, `Tooltip`, `Snackbar`, `Fab`, `Card`, `Chip`,
  `Switch`, `Slider`.
- M3 shapes (radius 12–28 px). Subtle elevation.
- Persisted in `localStorage`:
  - `settings.lang`
  - `settings.seedColor`
  - `settings.mode` (`auto` | `light` | `dark`)

**Never leak M3 tokens into site output.** Site output uses its own CSS variables.

## i18n

- `en.json` is source of truth. Flat namespaced keys
  (`topbar.save`, `home.newProject`, `pageTree.addPage`, `export.inProgress`).
- `ru.json` mirrors 1:1. Missing keys fall back to English.
- Default language: `en` unless browser prefers `ru`.
- Never hardcode UI strings in components.

## State

- **zustand** for writes: current project, active page id, page tree, UI flags,
  undo/redo history.
- **`useLiveQuery`** from `dexie-react-hooks` for reads (Home grid, settings).
- Writes always through zustand actions that also persist to Dexie.
- Never mix: reads via Dexie hooks, writes via zustand actions.

## Preview

- Preview menu in TopBar → build HTML → open as `blob:text/html` in new tab.
- No save required — uses current editor state.
- Assets inlined (objectURL or base64) so relative paths work inside blob URL.

## Undo / redo

- Shortcuts: `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, `Ctrl+Y`.
- Scope: current page's Puck data + page tree operations.
- Per-page history stack in zustand, debounced snapshots, cap 100 entries per page.
- If Puck provides built-in history in the installed version — use it, don't
  reimplement.

## Accessibility

- All interactive elements keyboard-reachable.
- Visible M3 focus ring on focus.
- Page `<title>` + `<meta name="description">` from Page settings.
- Exported HTML has `<html lang="en">` (or per-page `lang`).