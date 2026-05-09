# CLAUDE.md Sync Agent Memory

## Synced Documentation Files

### docs/routing.md (synced 2026-05-08)
- **File Path**: `/docs/routing.md`
- **Subject**: Routing standards, route structure, middleware protection, file-system conventions, page components, navigation
- **CLAUDE.md Entry Added**:
  ```
  ### Routing (`docs/routing.md`)
  - All authenticated app pages must live under `/dashboard` — public routes are `/`, `/sign-in`, `/sign-up`
  - Route protection is handled exclusively by `middleware.ts` — never add manual redirects in pages
  - Use Next.js `<Link>` for all internal navigation; use `useRouter` from `next/navigation` for programmatic navigation
  - Colocate **Server Actions** in `actions.ts` files next to the routes that use them
  ```
- **Format Notes**: Follows the existing `### Topic (docs/file.md)` style with 4 concise bullet points covering key rules from the doc

## Formatting Conventions
- Subsection headings use `### Topic (docs/filename.md)` format
- 2-5 bullet points per section (this project uses 3-4 typically)
- Key terms emphasized with **bold**
- File references use backticks: `` `docs/filename.md` ``
- Bullets are action-oriented (imperative/descriptive)
