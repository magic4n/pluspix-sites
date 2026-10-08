
---

# 📄 tz1/06-build-conventions.md

```markdown
# PlusPix — Build & conventions

## Tooling

- **Vite** for dev + build. No SSR, no Node server.
- **TypeScript** strict. No `any` except untyped third-party — narrow immediately.
- No custom ESLint/Prettier config beyond Vite defaults. Keep it lean.
- Node >= 20.

## Scripts
npm run dev # vite dev server
npm run build # tsc && vite build (must be 0 TS errors)
npm run preview # vite preview of built output
text


## Path aliases

`tsconfig.json` + `vite.config.ts`:

"@/" → "src/"

Use `@/...` imports throughout.

## Naming

- `camelCase` — vars, functions, hooks.
- `PascalCase` — components, types, interfaces.
- `SCREAMING_SNAKE` — module-level constants.
- File name matches default export.

## React

- Function components + hooks only. No classes.
- Split components > ~200 lines.
- Hooks at top of component.
- No `useEffect` for derived state — compute inline or use `useMemo`.

## State

- **zustand** for writes (editor state, current project, page tree, history).
- **`useLiveQuery`** (Dexie) for reads.
- Never mix: reads via Dexie hooks, writes via zustand actions that also
  persist to Dexie.

## Styling

- **Builder:** MUI `sx` prop or `styled()`. No Tailwind.
- **Site output:** plain CSS with variables. Emitted as a single `styles.css`.
- Never leak M3 tokens into site output.

## Import order

1. React + third-party.
2. `@/` absolute imports.
3. Relative imports.
4. CSS side-effect imports last.

## Comments

Only where non-obvious. No "// set state" noise. JSDoc only on exported public
APIs of `db/api.ts` and `export/*`.

## Git

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.
- One commit per logical step, not one giant commit per milestone.
- Never commit `node_modules/`, `dist/`, `.env*`.

## Error recovery

- **Build fails:** read error, fix root cause. If not fixed in 2 attempts —
  STOP, report BLOCKED with exact error + what you tried.
- **Runtime error:** ask user for console output. Do not guess.
- **Ambiguous spec:** STOP. Ask. Do not invent.
- **Library API mismatch:** check installed version in `node_modules`, adjust
  usage, note in "Deviations".

## Report format (mandatory at end of each milestone)
Milestone: M<N> — <name>
Status

DONE | PARTIAL | BLOCKED
Files created

    path — one-line purpose

Files modified

    path — what changed and why

Commands run

    npm run build → exit 0, 0 errors

    npm run dev → boots, no console errors

Deviations from spec

None. (or list each deviation + reason)
Open questions

None. (or numbered list)
Next milestone preview

One sentence describing M<N+1>. Do NOT start it.


## Global anti-patterns

- Do not add libraries the stack already covers.
- Do not create `utils.ts` grab-bags — helpers live next to their domain.
- Do not hand-roll drag-and-drop — dnd-kit is in the stack.
- Do not write a Markdown renderer — use a small existing one if needed.
- Do not implement SSR, hydration, or a routing framework — SPA with two screens.
- Do not leak M3 tokens into site output.
- Do not translate code identifiers to Russian — only UI strings.
- Do not run `npm install <pkg>` without explicit user approval.
- Do not run destructive shell commands (`rm -rf`, `git reset --hard`,
  force push) without explicit confirmation.
- Do not commit `node_modules/`, `dist/`, `.env*`.