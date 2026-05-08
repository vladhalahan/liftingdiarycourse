# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docs

Before generating any code, always read the relevant file(s) in the `/docs` directory first and strictly follow the standards defined there. Every area of the codebase has a corresponding doc — do not skip this step.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **Tailwind CSS v4** (configured via `@tailwindcss/postcss`)
- **TypeScript**
- **Drizzle ORM** + **Neon** (serverless Postgres), schema in `src/db/schema.ts`
- **Clerk** for authentication (`@clerk/nextjs`)

## Architecture

This is a fresh Next.js App Router project. All routes live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up Geist fonts via CSS variables (`--font-geist-sans`, `--font-geist-mono`) and applies a full-height flex column body. Global styles are in `src/app/globals.css`.

All database query and mutation helpers live in `src/data/`. Server Actions are colocated in `actions.ts` files next to the routes that use them.

## Code Generation Guidelines

### UI (`docs/ui.md`)
- Use **only shadcn/ui** components — no custom UI primitives
- Install missing components via `npx shadcn@latest add <component>`; they land in `src/components/ui/`
- Format all dates with **date-fns** using the format string `"do MMM yyyy"` (e.g. `1st Sep 2025`)

### Data Fetching (`docs/data-fetching.md`)
- Fetch data **only in Server Components** by calling helpers from `src/data/`
- Never fetch in client components, route handlers, or `useEffect`
- Every query must be scoped to the authenticated user's ID retrieved from Clerk server-side auth inside the helper — never passed in as an argument

### Data Mutations (`docs/data-mutations.md`)
- Mutations follow: **Server Action → `src/data/` helper → Drizzle ORM**
- Define Server Actions in colocated `actions.ts` files with `"use server"` at the top
- Actions must use **typed parameters** (no `FormData`) and validate all inputs with **Zod** before calling helpers
- Never call Drizzle directly inside a Server Action

### Auth (`docs/auth.md`)
- Use **Clerk exclusively** — no custom auth, NextAuth, or JWT logic
- Retrieve `userId` server-side via `auth()` from `@clerk/nextjs/server` inside data helpers
- Route protection is handled by `middleware.ts` — do not add manual redirect logic in pages
- Use Clerk's pre-built components (`<SignIn />`, `<SignUp />`, `<UserButton />`) for all auth UI
