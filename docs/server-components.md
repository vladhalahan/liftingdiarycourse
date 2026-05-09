# Server Component Standards

## Async Page Components

All page components are **async Server Components**. Always declare them with `async`:

```ts
export default async function MyPage() { ... }
```

## Route Params

This project uses **Next.js 15**, where `params` and `searchParams` are **Promises** and must be awaited before accessing their properties.

```ts
// ✅ Correct — await params before use
interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  ...
}
```

```ts
// ❌ Wrong — do not destructure params synchronously
export default async function EditWorkoutPage({ params: { workoutId } }: ...) { ... }
// ❌ Wrong — do not access params properties without awaiting
export default async function EditWorkoutPage({ params }: ...) {
  const id = params.workoutId; // ← runtime error in Next.js 15
}
```

The same rule applies to `searchParams`:

```ts
interface Props {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { date } = await searchParams;
  ...
}
```

## Data Fetching in Pages

Fetch data by calling helpers from `src/data/` directly in the page body — never in `useEffect` or client components. See `docs/data-fetching.md` for the full standard.

```ts
export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);

  if (!workout) notFound();

  return <EditWorkoutForm workout={workout} />;
}
```

## Not Found

Use Next.js's built-in `notFound()` from `next/navigation` when a resource does not exist or does not belong to the current user:

```ts
import { notFound } from "next/navigation";

if (!workout) notFound();
```

Do not throw errors or return null for missing resources — always call `notFound()`.
