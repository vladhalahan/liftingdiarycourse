# Data Fetching Standards

## Server Components Only

**All data fetching must be done exclusively via React Server Components.**

Do NOT fetch data in:
- Route handlers (`src/app/api/`)
- Client components (`"use client"`)
- Any other mechanism (SWR, React Query, `useEffect`, etc.)

This is non-negotiable. If a page or component needs data, it must be a Server Component that calls a helper function from the `/data` directory.

## Data Helper Functions

All database queries must live in helper functions under the `src/data/` directory.

Rules:
- Helper functions must use **Drizzle ORM** to query the database — do NOT write raw SQL
- Each helper function is responsible for one focused query or operation
- Helper functions must be called only from Server Components

Example structure:
```
src/data/
  workouts.ts
  exercises.ts
```

Example helper function:
```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## User Data Isolation

**A logged-in user must only ever be able to access their own data.**

Every query that returns user-owned data must filter by the authenticated user's ID. The user ID must be retrieved from the auth session (Clerk) inside the helper function itself — it must never be passed in from the client or from an untrusted source.

```ts
// src/data/workouts.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

Never trust a `userId` coming from query params, route params, or request bodies when scoping user data. Always derive it from the server-side auth session.
