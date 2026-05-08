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

## Architecture

This is a fresh Next.js App Router project. All routes live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up Geist fonts via CSS variables (`--font-geist-sans`, `--font-geist-mono`) and applies a full-height flex column body. Global styles are in `src/app/globals.css`.
