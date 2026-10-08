# PlusPix

> **Local-first, multi-page, block-based website builder with zero backend.**

PlusPix is a private, client-side website builder running entirely in the browser. It allows you to design multi-page websites visually using customizable blocks, curate typography and color palettes, and export standalone static sites that open directly offline by double-clicking `index.html`.

---

## 🌟 Key Features

- **100% Client-Side & Local-First:** No backend server, no telemetry, no tracking. All projects, pages, and assets are stored locally in your browser via IndexedDB (Dexie).
- **Block-Based Visual Editor:** Integrated with [@measured/puck](https://github.com/measuredco/puck) with 23 pre-built blocks organized into 5 logical categories (Layout, Typography, Media, Actions, Content).
- **Multi-Page Hierarchy:** Visual drag-and-drop page tree powered by `@dnd-kit`, support for nesting, custom URL slugs, automatic path resolution, and smart deletion (promote children vs. delete subtree).
- **Curated Themes & Typography:** 8 hand-crafted design themes (Minimal Light/Dark, Editorial, Brutalist, Warm, Forest, Mono, Pastel) and 22 Google Font pairings injected live into the editor canvas via CSS custom properties.
- **Instant Preview:** Preview individual pages or full multi-page sites directly in an isolated tab using Blob URLs and offline routing without saving to disk.
- **Self-Contained Offline ZIP Export:** Compiles projects into static HTML and CSS with pure relative paths. Exported archives run completely offline without an HTTP server or web server setup.
- **Full Project Round-Trip Import:** Exported ZIP archives include `.pluspix/manifest.json`, enabling seamless re-import on any device.
- **Material You (M3) Builder UI:** Expressive builder interface adhering to Material Design 3 guidelines with dynamic seed color theming, dark/light modes, and full English (`en`) and Russian (`ru`) localization.
- **Keyboard Shortcuts:** Built-in shortcuts for saving (`Ctrl+S`), page preview (`Ctrl+P`), site preview (`Ctrl+Shift+P`), undo/redo (`Ctrl+Z` / `Ctrl+Y`), and help modal (`?`).

---

## 🏗️ Architecture & Tech Stack

```text
┌────────────────────────────────────────────────────────┐
│                      Builder UI                        │
│   Material Design 3 (MUI) + Zustand + i18next (en/ru)  │
├──────────────────────────┬─────────────────────────────┤
│       Page Tree          │         Puck Canvas         │
│   @dnd-kit Sortable      │   23 Modular Custom Blocks  │
├──────────────────────────┴─────────────────────────────┤
│                     Local Storage                      │
│            Dexie.js (IndexedDB) Schema v1              │
├──────────────────────────┬─────────────────────────────┤
│         Preview          │       Export / Import       │
│   Blob URL Router        │   JSZip + Pure Relative CSS │
└──────────────────────────┴─────────────────────────────┘
```

- **Runtime & Tooling:** Node.js >= 20, Vite, TypeScript (strict mode)
- **Editor Framework:** `@measured/puck`
- **Builder UI Components:** `@mui/material`, `@emotion/react`, `@emotion/styled`
- **M3 Color Generation:** `@material/material-color-utilities`
- **Local Database:** `dexie`, `dexie-react-hooks`
- **State Management:** `zustand`
- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Packaging & Archives:** `jszip`, `file-saver`
- **Internationalization:** `i18next`, `react-i18next`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- `npm` v10 or higher

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/pluspix/pluspix.git
cd pluspix
npm install
```

### Running the Development Server

Start the local Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

Verify TypeScript types and compile the optimized production bundle:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

---

## 📖 How to Use

### 1. Projects Screen
- **Create Project:** Click "+ New project", choose a name, and start building.
- **Duplicate Project:** Click the options menu (`⋮`) on any project card and select "Duplicate".
- **Rename Project:** Double-click the project title on the card or in the editor toolbar.
- **Import ZIP:** Click "Import ZIP" to upload and restore a previously exported PlusPix ZIP archive.

### 2. Page Hierarchy & Settings
- Use the left sidebar to add top-level pages or nested subpages.
- Drag and drop pages to reorder or nest them.
- Click **"Page settings"** to adjust the URL slug and SEO meta description.
- The root home page automatically routes to `index.html` upon export.

### 3. Visual Block Editor
- Browse the 23 blocks categorized into:
  - **Layout:** Section, Columns, Divider, Spacer
  - **Typography:** Heading, RichText, Quote, CodeBlock
  - **Media:** Image, Gallery, VideoEmbed, MapEmbed
  - **Actions:** Button, LinksList, Navbar, Footer
  - **Content:** Hero, Card, FeatureGrid, Stats, Testimonial, FAQ, ContactInfo
- Customize typography, alignments, spacing, colors, and embedded assets with live visual feedback.

### 4. Site Themes & Fonts
- Click **"Site theme"** in the sidebar to select from 8 design systems:
  - `Minimal Light`
  - `Minimal Dark`
  - `Editorial`
  - `Brutalist`
  - `Warm`
  - `Forest`
  - `Mono`
  - `Pastel`
- Choose from 22 curated Google Font pairings for headlines and body text.

### 5. Preview & Export
- **Preview:** Click **"Preview"** in the top bar to test the active page or navigate the full multi-page site in an isolated preview tab.
- **Export ZIP:** Click **"Export"** to generate an offline-ready ZIP archive. Extract the archive and double-click `index.html` — no web server required!

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + S` / `⌘ + S` | Force-save project immediately |
| `Ctrl + P` / `⌘ + P` | Preview active page in a new tab |
| `Ctrl + Shift + P` / `⌘ + Shift + P` | Preview entire site with multi-page navigation |
| `Ctrl + Z` / `⌘ + Z` | Undo block edits |
| `Ctrl + Shift + Z` / `Ctrl + Y` | Redo block edits |
| `?` or `F1` or `Ctrl + /` | Open Keyboard Shortcuts cheat sheet |
| `Esc` | Close open dialogs or panels |

---

## 🌐 Browser Support

- **Chromium-based browsers:** Google Chrome, Brave, Microsoft Edge, Opera (v110+)
- **Mozilla Firefox:** v115+
- *Note:* Safari is not an explicit target platform.

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
