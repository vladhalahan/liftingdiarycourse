# Routing Standards

## Route Structure

All application routes live under `/dashboard`. The `/dashboard` route and all sub-routes are protected and only accessible to authenticated users.

```
/                        ← public (landing/marketing)
/sign-in                 ← public (Clerk)
/sign-up                 ← public (Clerk)
/dashboard               ← protected
/dashboard/workout/new   ← protected
/dashboard/workout/[id]  ← protected
```

Do NOT place authenticated app pages outside of `/dashboard`.

## Route Protection

Route protection is handled exclusively via Next.js middleware (`middleware.ts` at the project root). Do NOT add manual redirect logic inside page components.

The middleware uses Clerk to define public routes — everything else is automatically protected:

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

When adding a new protected route, no changes to the middleware are needed — any route not listed in `isPublicRoute` is protected automatically.

When adding a new **public** route, add it to the `isPublicRoute` matcher list.

## File System Conventions

Routes follow Next.js App Router file-system conventions:

- `page.tsx` — the page component for a route segment
- `layout.tsx` — shared layout wrapping child routes
- `loading.tsx` — loading UI for a segment
- `error.tsx` — error boundary for a segment
- `actions.ts` — Server Actions colocated with the route that uses them

Dynamic segments use bracket notation: `[workoutId]`, `[id]`, etc.

## Page Components

All page components must be `async` Server Components. See `docs/server-components.md` for full standards on `params`, `searchParams`, and data fetching inside pages.

## Navigation

Use Next.js's `<Link>` component for all internal navigation. Do not use `<a>` tags for internal links.

```tsx
import Link from "next/link";

<Link href="/dashboard">Dashboard</Link>
```

For programmatic navigation in client components, use the `useRouter` hook from `next/navigation`:

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();
router.push("/dashboard");
```
