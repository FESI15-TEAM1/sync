# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # start dev server (turbopack)
npm run dev:ws       # mock STOMP/WebSocket server (ws://localhost:8080/ws) for local playroom-chat dev
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
- Route groups: `src/app/(auth)/` holds `login`/`signup`; `src/app/(main)/` holds the home page. Other feature routes (`group`, `playlist`, `playroom`, `profile`, `search`, `stage`) each keep page-local building blocks in a `_components/` (or similarly named, e.g. plain `components/` under `(auth)`) subfolder next to the route.

### API integration — two layers, one shared error type

Calls to the app's own backend go through two hops, not straight from the client to the backend:

1. **Client/server components call `apiClient()`** from `src/lib/http/client-fetch.ts`, which hits this app's own `/api/*` route handlers (relative URL, `credentials: 'include'`).
2. **Route handlers under `src/app/api/**/route.ts`** call `request()` from `src/lib/http/server-fetch.ts`, which proxies to the real backend (`NEXT_PUBLIC_BE_API_URL`, currently `https://sync-back.store`). This is where auth actually lives: it reads `accessToken`/`refreshToken` from Next's cookie store, forwards them as `Cookie` headers (the backend does not accept `Authorization: Bearer`), transparently retries once via `/auth/refresh` on a 401, and re-mints this app's own httpOnly `accessToken`/`refreshToken` cookies from the backend's `Set-Cookie` response.
3. Both layers throw a shared `APIError` (`src/lib/http/error.ts`, `{status, code, message}`). Route handlers catch it and translate it into `Response.json({ error: { code, message } }, { status })` — follow this same catch/translate shape in any new route handler.

Per-domain API functions live in `src/services/<domain>/` (`auth`, `playlist`, `user`), split into `<domain>.api.ts` (thin functions calling `apiClient`) and `<domain>.types.ts` (request/response types). Follow this split for new domains rather than adding ad-hoc fetches inside components.

`src/app/api/youtube/client.ts` is a separate, one-off pattern for the external YouTube Data API: a typed `request<T>()` helper plus its own `YoutubeApiError` class, calling `googleapis.com` directly with `YOUTUBE_API_KEY` (not proxied through `server-fetch.ts`, since it isn't this app's backend).

The full backend contract is dumped at `openapi.md` (repo root, generated OpenAPI 3.1 JSON — not hand-maintained) — check it when the shape of a request/response body is unclear rather than guessing.

### Real-time chat

Playroom chat uses STOMP over WebSocket via `@stomp/stompjs` (`src/app/playroom/[playroomId]/_hooks/useChat.ts`), connecting to `NEXT_PUBLIC_WS_URL` and following Spring's STOMP conventions (`SUBSCRIBE /sub/playroom/{id}`, `SEND /pub/playroom/{id}/chat`). For local development without the real backend, `npm run dev:ws` runs `scripts/mock-stomp-server.mjs`, a mock STOMP server on `ws://localhost:8080/ws` that mimics the same subscribe/publish/broadcast semantics.

- **Client global state** uses Zustand with the SSR-safe context-provider pattern (see `src/stores/sidebar-store.ts` + `src/providers/sidebar-store-provider.tsx`): a vanilla store factory (`createStore` from `zustand/vanilla`) is instantiated once per-request inside a `'use client'` provider component (`useState(() => createStore())`), exposed through React Context, and consumed via a `useXStore(selector)` hook that throws if used outside its provider. `player-store` and `user-store` follow the same pattern alongside `sidebar-store`. Follow this pattern rather than a module-level singleton store when adding new client state.
- **Server/remote state**: `@tanstack/react-query` + devtools are dependencies for data fetching/caching, not yet wired into any component — reach for them (instead of ad-hoc `useEffect` fetching) when adding client-side data fetching.
- Shared form-field styling lives in `src/components/Input.tsx` as the exported `fieldStyle` constant (built with `clsx` + `tailwind-merge`); `src/components/Textarea.tsx` imports it to stay visually consistent with `Input`. Reuse `fieldStyle` for any new form-field component instead of duplicating the class string.
- `src/components/` holds generic/shared UI (`Button`, `Input`, `Textarea`, `IconButton`, and `common/`); `src/components/domain/` holds domain-specific presentational components (`PlaylistCard`, `Track`, `domain/layout/`).
- Path aliasing and TS config: `strict: true`, `moduleResolution: "bundler"`, only `@/*` is aliased — no other custom path aliases exist.

## Testing

- Jest + `@testing-library/react`, environment `jsdom`, config built via `next/jest`.
- Setup file `jest.setup.ts` only imports `@testing-library/jest-dom` matchers.
- Components that consume a Zustand store hook (e.g. anything using `useSidebarStore`) must be rendered wrapped in their provider in tests — see `src/app/page.test.tsx` for the pattern (`render(<SidebarStoreProvider><Component /></SidebarStoreProvider>)`).

## Lint conventions

- Import order is enforced by `eslint-plugin-simple-import-sort` (auto-sorted, not alphabetical-by-hand).
- `@typescript-eslint/consistent-type-imports` is an error — use `import { type Foo } from '...'` for type-only imports.

## Naming & style conventions

Enforced project-wide (from `.coderabbit.yaml` review rules, not currently linted automatically — apply by hand):

- Components (files/functions): `PascalCase`. Pages/layouts: Next.js defaults (`page.tsx`, `layout.tsx`).
- Hooks: `camelCase` with a `use` prefix.
- Plain functions/variables: `camelCase`. API functions: verb + noun in `camelCase` (e.g. `checkNickname`).
- Constants: `SCREAMING_SNAKE_CASE`. Types/interfaces: `PascalCase`.
- Event handlers: `handle` prefix. Boolean variables: `is`/`has` prefix.
- Wrap error-prone calls in `try/catch` (see the route-handler error-translation pattern above).
- Always define a TypeScript type for API response data — don't leave it as inferred/`any`.
