## Purpose
This file gives concise, actionable guidance for AI coding agents working on this Expo + React Native codebase.

## Quick start (commands)
- Install: `npm install`
- Start dev server: `npm start` (runs `expo start`) or `npx expo start`
- Platform shortcuts: `npm run android`, `npm run ios`, `npm run web`
- Reset starter project: `npm run reset-project`
- Tests: `npm test` (runs `jest --watchAll`)
- Lint: `npm run lint` (runs `expo lint`)

## Big-picture architecture
- Expo app using `expo-router` file-based routing. Entry point is `package.json` -> `expo-router/entry`.
- UI code lives in the `app/` directory (file-based routes). Examples: `app/board/[userId].tsx`, `app/board/edit/[boardId].tsx` and nested routes under `app/board/edit-*/`.
- Global state: Redux Toolkit under `store/` (`store/index.ts`, `store/slices/global.ts`). Many UI settings are persisted to `expo-secure-store` inside the global slice.
- Persistent data: `storage/index.ts` is the SQLite wrapper (uses `expo-sqlite`). It exposes `initDb`, `getBoard`, `addUser`, `addGroup`, `migration`, `checkDatabaseStructure`, etc. `app/_layout.tsx` calls `STORAGE.initDb()` and `checkDatabaseStructure()` on startup.
- Theming: uses `react-native-paper` with custom theme objects in `themes/` (`skyflare`, `playful`, `amoled`) and `app/_layout.tsx` chooses theme based on SecureStore and device color scheme.
- Components: all present in `components/` (small, focused components such as `Header.tsx`, `Card.tsx`, `EditGroup.tsx`). Reuse components where possible.
- Localization: `localization/` with language JSON files and a `useTranslation` hook pattern.

## Project-specific conventions & patterns
- Routing: add screens under `app/` — path and filename determine routes. Dynamic segments use square brackets: e.g. `app/board/[userId].tsx`.
- Header: screens use the `Stack` from `expo-router` and a shared `Header` component (see `app/_layout.tsx`).
- DB schema changes: update `storage/index.ts` `expectedSchema`, and implement migration logic in `migration()` and `addMissingColumns()`; `checkDatabaseStructure()` is run on startup.
- Persisted settings: `store/slices/global.ts` writes many settings directly to `expo-secure-store` inside reducers (this repo expects simple synchronous-style usage). When adding new persisted settings, mirror that pattern (set in reducer and call `SecureStore.setItem`).
- Type imports: project uses path alias `@/` (configured in `tsconfig.json`) — use `@/components/...`, `@/storage`, etc.
- Redux shape: `store/index.ts` exposes `RootState` and `AppDispatch` types — use them when creating typed hooks or thunks.

## Integration points and important files to inspect
- Routing and global layout: `app/_layout.tsx`
- Example route: `app/board/[userId].tsx`
- DB layer: `storage/index.ts` (read and update carefully)
- Global state: `store/slices/global.ts`
- Theme tokens: `themes/` (Skyflare, Playful, Amoled)
- Component patterns: `components/` (see `Header.tsx`, `Card.tsx`, `QuickAdd.tsx`)
- Localization: `localization/` and `localization/languages/*` JSON files

## When implementing features or fixes — concrete guidance
- Adding a route: create file under `app/` using file-based routing and export a default React component. For dynamic params use `[param].tsx` and read params via `expo-router` hooks.
- Changing DB schema: add new columns to `expectedSchema` in `storage/index.ts`, implement migration logic inside `migration()` and test startup path (`app/_layout.tsx` runs checks). Keep `addMissingColumns()` behavior consistent.
- Persisted UI setting: add reducer in `store/slices/global.ts` and write to `expo-secure-store` inside the reducer as existing patterns do.
- Styling and themes: reuse theme tokens from `themes/` and `constants/styles.ts`; prefer existing `react-native-paper` setup in `app/_layout.tsx`.
- Testing: unit tests use `jest-expo`. Use `npm test` and reference `jest` config in `package.json`.

## Useful heuristics for code suggestions
- Prefer reusing components from `components/` rather than creating new ones for common UI.
- For persistent changes, touch both `storage/index.ts` and any callers (e.g., components or actions that expect new API surface).
- Respect the file-based routing structure — do not change route behavior by adding custom navigation unless necessary.

## If you need clarification
- Ask which screen, component or data flow to change (route path, store action, or DB migration). Point to the file you plan to edit.

---
Please review this file for missing details or policies you want enforced (naming, tests, commit message conventions). I can iterate on specifics or merge into an existing doc if you prefer.
