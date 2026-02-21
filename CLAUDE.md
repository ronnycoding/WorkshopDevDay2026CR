# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

T3 Stack application (create-t3-app v7.40.0) using Next.js 15, tRPC v11, Drizzle ORM, Better Auth, and Tailwind CSS v4. Package manager is pnpm.

## Commands

- `pnpm dev` - Start dev server with Turbopack
- `pnpm build` - Production build
- `pnpm check` - Lint/format check with Biome
- `pnpm check:write` - Auto-fix lint/format issues
- `pnpm check:unsafe` - Auto-fix including unsafe transformations
- `pnpm typecheck` - TypeScript type checking (`tsc --noEmit`)
- `pnpm db:generate` - Generate Drizzle migrations
- `pnpm db:migrate` - Run Drizzle migrations
- `pnpm db:push` - Push schema directly to database (no migration files)
- `pnpm db:studio` - Open Drizzle Studio GUI

## Architecture

### Path alias

`~/` maps to `./src/` (configured in tsconfig.json).

### Server layer (`src/server/`)

- **Database**: SQLite via `@libsql/client` + Drizzle ORM. Schema in `src/server/db/schema.ts`, connection in `src/server/db/index.ts`. Tables are prefixed with `workshop_devday_2026cr_*` (see `drizzle.config.ts` `tablesFilter`).
- **Auth**: Better Auth with email/password only. Config in `src/server/better-auth/config.ts`. Client-side auth helper in `src/server/better-auth/client.ts`. Cached server-side session helper in `src/server/better-auth/server.ts`. Auth tables (`user`, `account`, `session`, `verification`) are defined alongside app tables in the schema file.
- **tRPC**: v11 with SuperJSON transformer. Context provides `db` and `session`. Two procedure types: `publicProcedure` (unauthenticated) and `protectedProcedure` (requires session). Router definitions go in `src/server/api/routers/` and must be registered in `src/server/api/root.ts`.

### Client layer (`src/trpc/`)

- `src/trpc/react.tsx` - Client Components: `api` hook from `createTRPCReact`, wrapped in `TRPCReactProvider`
- `src/trpc/server.ts` - Server Components (RSC): `api` + `HydrateClient` from tRPC hydration helpers

### API routes (`src/app/api/`)

- `/api/trpc/[trpc]` - tRPC HTTP handler
- `/api/auth/[...all]` - Better Auth handler (via `toNextJsHandler`)

### Environment

Validated with `@t3-oss/env-nextjs` in `src/env.js`. Required vars: `DATABASE_URL`. `BETTER_AUTH_SECRET` required in production only. Set `SKIP_ENV_VALIDATION=1` to bypass validation during builds.

### Styling & Linting

Tailwind CSS v4 with PostCSS. Biome for linting/formatting (replaces ESLint + Prettier). Biome sorts imports, attributes, and Tailwind classes (via `useSortedClasses` for `clsx`/`cva`/`cn` helpers).
