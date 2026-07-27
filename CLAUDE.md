# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server (turbopack)
npm run build        # production build
npm run lint         # eslint (flat config, eslint.config.mjs)
npm test             # run jest test suite once
npm run test:watch   # jest in watch mode
npx jest path/to/file.test.tsx   # run a single test file
npx jest -t "test name"          # run tests matching a name
```

`npm run prepare` installs the husky git hooks. The pre-commit hook runs `npm run lint` and `npm test` — both must pass to commit.

## Architecture

- **Next.js App Router**, TypeScript, Tailwind CSS v4, path alias `@/*` → `src/*`.
- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`) — avoid manual `useMemo`/`useCallback` optimizations unless there's a specific reason; let the compiler handle memoization.
- SVGs are imported as React components via `@svgr/webpack` (configured under `turbopack.rules` in `next.config.ts`), e.g. `import EyeIcon from '@/assets/icons/eye.svg'`. In Jest, SVG imports are mocked by `__mocks__/svg.tsx` via `moduleNameMapper` in `jest.config.ts`.
- Route groups: `src/app/(auth)/` holds `login`/`signup`; feature routes (`group`, `playlist`, `playroom`, `search`, `stage`) each keep page-local building blocks in a `_components/` (or similarly named) subfolder next to the route.
- `src/app/api/` contains Next.js route handlers; `src/app/api/youtube/client.ts` wraps the YouTube Data API with a typed `request<T>()` helper and a `YoutubeApiError` class — follow this pattern (typed request wrapper + custom error class) for other external API integrations.
- **Client global state** uses Zustand with the SSR-safe context-provider pattern (see `src/stores/sidebar-store.ts` + `src/providers/sidebar-store-provider.tsx`): a vanilla store factory (`createStore` from `zustand/vanilla`) is instantiated once per-request inside a `'use client'` provider component (`useState(() => createStore())`), exposed through React Context, and consumed via a `useXStore(selector)` hook that throws if used outside its provider. Follow this pattern rather than a module-level singleton store when adding new client state.
- **Server/remote state**: `@tanstack/react-query` + devtools are dependencies for data fetching/caching from route handlers or external APIs.
- Shared form-field styling lives in `src/components/Input.tsx` as the exported `fieldStyle` constant (built with `clsx` + `tailwind-merge`); `src/components/Textarea.tsx` imports it to stay visually consistent with `Input`. Reuse `fieldStyle` for any new form-field component instead of duplicating the class string.
- `src/components/` holds generic/shared UI (`Button`, `Input`, `Textarea`, `IconButton`, and `common/`); `src/components/domain/` holds domain-specific presentational components (`PlaylistCard`, `Track`, `domain/layout/`).
- Path aliasing and TS config: `strict: true`, `moduleResolution: "bundler"`, only `@/*` is aliased — no other custom path aliases exist.

## Testing

- Jest + `@testing-library/react`, environment `jsdom`, config built via `next/jest`.
- Setup file `jest.setup.ts` only imports `@testing-library/jest-dom` matchers.
- Components that consume a Zustand store hook (e.g. anything using `useSidebarStore`) must be rendered wrapped in their provider in tests — see `src/app/testPage.test.tsx` for the pattern (`render(<SidebarStoreProvider><Component /></SidebarStoreProvider>)`).

## Lint conventions

- Import order is enforced by `eslint-plugin-simple-import-sort` (auto-sorted, not alphabetical-by-hand).
- `@typescript-eslint/consistent-type-imports` is an error — use `import { type Foo } from '...'` for type-only imports.
