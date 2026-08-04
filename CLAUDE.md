# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev          # dev server (Next 16 → Turbopack by default)
npm run dev:https    # dev server over HTTPS
npm run build        # production build
npm run lint         # eslint (flat config, eslint.config.mjs)
npm test             # jest suite once
npm run test:watch   # jest watch mode
npx jest path/to/file.test.tsx   # single test file
npx jest -t "test name"          # tests matching a name
```

Node >= 24 is required. `npm run prepare` installs husky hooks; the pre-commit hook runs `npm run lint` and `npm test`, and CI runs the same two before deploying to Vercel.

## Architecture

Next.js App Router + TypeScript + Tailwind v4, `strict: true`, path alias `@/*` → `src/*` (the only alias). This is a Korean-language product: UI strings, code comments, and API error messages are in Korean — match that when editing.

### Request flow — the core pattern

The browser never talks to the backend directly. Every call goes:

component → `src/services/<domain>/*.api.ts` → `clientFetch` → own route handler under `src/app/api/` → `serverFetch` → backend

- **`clientFetch`** (`src/lib/http`) is browser-side and based at `/api`, so it only ever reaches this app's own route handlers. It throws `APIError` parsed from the response's `{ error: { code, message } }` envelope.
- **`serverFetch`** (`src/lib/http`) is for route handlers and server components only — it reads cookies. It attaches the bearer token, transparently refreshes an expired one and retries once, and clears the auth cookies if refresh fails.
- **`APIError(status, code, message)`** is the single error type crossing both boundaries.

Auth is httpOnly-cookie based and always set server-side in a route handler; tokens are never exposed to client JS.

**Every route handler follows the same shape** — call `serverFetch` inside a `try`, and in `catch` re-emit an `APIError` as the `{ error: { code, message } }` envelope with its status, falling back to a 500 envelope otherwise. Keep that envelope intact: `clientFetch` parses exactly this shape, so deviating breaks client-side error messages.

`src/services/<domain>/` holds `*.api.ts` (thin functions over `clientFetch`/`serverFetch`) plus `*.types.ts` for request/response types. Always check which fetcher a service uses — a `serverFetch`-based service is server-only and cannot be called from a client component.

`swagger.json` at the repo root is the backend's OpenAPI spec — consult it for endpoint shapes instead of guessing.

### External APIs

Third-party integrations get their own client module under `src/app/api/<service>/`: a typed `request<T>()` wrapper plus a custom error class, with the API key read server-side and never sent to the client.

### Client state

Zustand with the **SSR-safe context-provider pattern**, not module-level singletons: a vanilla `createStore()` factory in `src/stores/`, instantiated once per request via `useState(() => createXStore())` inside a `'use client'` provider in `src/providers/`, exposed through React Context, and consumed via a `useXStore(selector)` hook that throws outside its provider. Follow this pattern for any new global client state, and render such components inside their provider in tests.

`@tanstack/react-query` is installed but **not yet wired up** — there is no `QueryClientProvider` and no `useQuery` call anywhere. Data fetching today is server components plus direct `*.api.ts` calls; adding react-query means introducing the provider first.

### Components & routing

- `src/components/` — generic UI; `src/components/domain/` — domain-specific presentational components.
- Route-local building blocks live in a `_components/` folder beside the route. Route groups: `(auth)` for login/signup, `(main)` for the home page.
- Shared form-field styling is a single exported class constant (clsx + tailwind-merge) that field components compose — reuse it instead of duplicating the class string.
- **React Compiler is enabled** (`reactCompiler: true`) — skip manual `useMemo`/`useCallback` unless there's a specific reason.
- SVGs import as React components via `@svgr/webpack`: `import EyeIcon from '@/assets/icons/eye.svg'`. Remote image hosts must be allowlisted in `next.config.ts`.

## Conventions

- Import order enforced by `eslint-plugin-simple-import-sort` (auto-sorted, not hand-alphabetized); `@typescript-eslint/consistent-type-imports` is an error — use `import { type Foo } from '...'`.
- Prettier: single quotes, semicolons, trailing commas, 2-space indent, `prettier-plugin-tailwindcss` sorts class names.
- Naming (also enforced in CodeRabbit review, `.coderabbit.yaml`): components PascalCase, hooks `use` + camelCase, API functions verb+noun camelCase, constants SCREAMING_SNAKE_CASE, handlers `handle*`, booleans `is`/`has`. Always type API response data; wrap fallible calls in try-catch.
