# Data Mutation Standards

## Overview

Data mutations follow a two-layer pattern: **Server Actions** call **data helper functions**, which execute database operations via Drizzle ORM.

```
Server Action (actions.ts)  →  Data Helper (src/data/)  →  Drizzle ORM  →  Database
```

## Data Helper Functions

All database mutation logic must live in helper functions under the `src/data/` directory — the same directory as query helpers. Each helper function is responsible for one focused mutation.

Rules:
- Must use **Drizzle ORM** — do NOT write raw SQL
- Must retrieve the authenticated user's ID from Clerk server-side auth, never from arguments
- One function per operation (insert, update, delete)

Example:

```ts
// src/data/workouts.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(name: string, date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.insert(workouts).values({ userId, name, date });
}

export async function deleteWorkout(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.delete(workouts).where(eq(workouts.id, id), eq(workouts.userId, userId));
}
```

## Server Actions

All data mutations must be triggered via **Next.js Server Actions**. Server Actions must be defined in colocated `actions.ts` files — one per route or feature directory.

```
src/app/dashboard/actions.ts
src/app/workouts/[id]/actions.ts
```

Rules:
- Every `actions.ts` file must have `"use server"` at the top
- Server Actions must call data helper functions from `src/data/` — they must NOT contain raw Drizzle or SQL calls directly
- Server Actions must NOT accept `FormData` as a parameter type — use typed parameters only
- All parameters must have explicit TypeScript types
- All parameters must be validated with **Zod** before use

Example:

```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(params: { name: string; date: Date }) {
  const { name, date } = createWorkoutSchema.parse(params);
  await createWorkout(name, date);
}
```

## Zod Validation

Every Server Action must define and apply a Zod schema to validate its arguments before passing them to any data helper function. Do not trust or use raw input values before validation.

- Define the schema in the same file as the action
- Use `.parse()` (throws on invalid input) rather than `.safeParse()` unless you need to handle errors manually
- Coerce types where appropriate (e.g. `z.coerce.date()` for date strings)

## Redirects

Do NOT use `redirect()` inside Server Actions. Redirects must be handled client-side after the Server Action resolves.

```ts
// ✅ Correct — redirect client-side after action resolves
const router = useRouter();

async function handleSubmit() {
  await createWorkoutAction({ name, date });
  router.push("/dashboard");
}

// ❌ Wrong — do not call redirect() inside a Server Action
export async function createWorkoutAction(params: { name: string; date: Date }) {
  const { name, date } = createWorkoutSchema.parse(params);
  await createWorkout(name, date);
  redirect("/dashboard"); // ← never do this
}
```

## What NOT to Do

- Do NOT call Drizzle ORM directly inside a Server Action — always go through a `src/data/` helper
- Do NOT use `FormData` as a parameter type in any Server Action
- Do NOT skip Zod validation, even for simple or single-field inputs
- Do NOT pass `userId` as a parameter to data helpers — always derive it from the server-side Clerk session inside the helper
- Do NOT place Server Actions in files other than `actions.ts`
- Do NOT use `redirect()` inside Server Actions — handle redirects client-side after the action resolves
