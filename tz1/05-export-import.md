
---

# 📄 tz1/05-export-import.md

```markdown
# PlusPix — Export / Import / Preview

## HTML generation

Use `renderToStaticMarkup` from `react-dom/server` (browser build). Same React
components as the editor — single source of truth for block rendering.

```ts
import { renderToStaticMarkup } from 'react-dom/server';
Preview

preview/previewBuilder.ts:

    Input: Project, Page | 'all'.

    Output: HTML string.

    Assets inlined:

        small (< 50 KB) → base64 data URL

        large → URL.createObjectURL(blob) (valid only inside preview tab)

    Theme CSS: inline <style> from applyTheme(project.theme).

    Google Fonts: <link> for the project's chosen pair.

    Internal links (root ↔ subpages): use ?page={id} query routing inside
    preview HTML. Blob URLs have no paths, so file-based links won't work.

Open in new tab as blob:text/html. No save required.
Export

export/renderSite(project, pages, assets):

    Build HTML per page → path from tree:

        root index → index.html

        other → {slug}/index.html

        nested → {parent}/{child}/index.html

    assets/css/styles.css = base blocks CSS + theme CSS + font @import.

    Copy assets to assets/images/{filename}.

    Rewrite <img src> in HTML to relative paths:

        root page → assets/images/foo.jpg

        subpage → ../assets/images/foo.jpg

        nested → ../../assets/images/foo.jpg

    Root index.html at ZIP root.

    .pluspix/manifest.json with project structure (see below).

buildZip() uses jszip. downloadZip() uses file-saver.
Progress dialog lists pages being rendered.
ZIP structure
text

{project.name}.zip
├── index.html
├── about/
│   └── index.html
├── team/
│   └── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── images/
│       ├── hero.jpg
│       └── logo.svg
└── .pluspix/
    └── manifest.json

Acceptance

Exported ZIP opens offline by double-clicking index.html. No absolute paths,
no blob:, no data: URLs in HTML.
Manifest

.pluspix/manifest.json:
json

{
  "version": 1,
  "generator": "pluspix",
  "project": {
    "id": "abc123",
    "name": "My Site",
    "theme": { "id": "editorial", "customOverrides": {} },
    "fontPairId": "inter-playfair",
    "rootPageIds": ["p_home"],
    "pages": {
      "p_home": {
        "id": "p_home",
        "parentId": null,
        "order": 0,
        "slug": "index",
        "title": "Home",
        "metaDescription": "",
        "puckData": { "content": [], "root": {} }
      }
    }
  },
  "assets": [
    { "id": "a_1", "filename": "hero.jpg", "mime": "image/jpeg" }
  ]
}

Assets themselves live under assets/images/ inside the ZIP and are re-linked
by filename.
Import

export/importZip.ts:

    Home screen → Import button.

    Read .pluspix/manifest.json → reconstruct project (structure, theme,
    fonts, assets).

    Without manifest → unpack HTML as assets under a new project "Imported",
    no structure.

    Validate:

        manifest schema (Zod or manual type guard)

        referenced assets exist in ZIP

    Bad ZIP → friendly error dialog, no crash.

Acceptance

Export → Import round-trips project (structure, theme, fonts, assets).
