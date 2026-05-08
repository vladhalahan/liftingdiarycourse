# Auth Coding Standards

## Authentication Provider

**This app uses [Clerk](https://clerk.com/) for authentication exclusively.**

Do NOT use NextAuth, custom JWT logic, session cookies, or any other auth mechanism. All authentication and session management is handled by Clerk.

## Server-Side Auth

Retrieve the authenticated user's ID on the server using Clerk's `auth()` helper from `@clerk/nextjs/server`:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

This must be called inside Server Components or data helper functions — never on the client.

## Client-Side Auth

For client components that need user identity, use Clerk's `useUser` or `useAuth` hooks:

```ts
import { useUser } from "@clerk/nextjs";

const { user } = useUser();
```

Do not pass `userId` from server to client as a prop for the purpose of data fetching or access control. Server-side auth must gate all data access independently.

## Protecting Routes

Route protection is handled via Clerk's middleware. The `middleware.ts` file at the project root defines which routes are public and which require authentication.

Do NOT implement manual redirect logic in page components to protect routes — rely on the middleware.

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

## UI Components

Use Clerk's pre-built components for sign-in, sign-up, and user profile UI:

- `<SignIn />` — sign-in page
- `<SignUp />` — sign-up page
- `<UserButton />` — account menu / sign-out (used in the navbar)
- `<SignedIn>` / `<SignedOut>` — conditionally render content based on auth state

Do NOT build custom sign-in/sign-up forms or user account UI.

## User Data Isolation

Every database query that returns user-owned data must be scoped to the authenticated user's ID retrieved from the server-side Clerk session. See `docs/data-fetching.md` for the full standard.

Never trust a `userId` from query params, route params, or request bodies for access control purposes.
