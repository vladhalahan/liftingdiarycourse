import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDurationMinutes(startedAt: Date, endedAt: Date | null) {
  if (!endedAt) return null;
  return Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
}

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center">
        <p className="text-zinc-400">Sign in to view your workouts.</p>
      </main>
    );
  }

  const workoutsList = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
    .orderBy(desc(workouts.startedAt));

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-white">My Workouts</h1>

      {workoutsList.length === 0 ? (
        <p className="text-zinc-400">No workouts yet. Start lifting!</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {workoutsList.map((workout) => {
            const duration = getDurationMinutes(workout.startedAt, workout.endedAt);
            return (
              <li key={workout.id}>
                <Link
                  href={`/workouts/${workout.id}`}
                  className="block rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {workout.name ?? "Untitled Workout"}
                    </span>
                    {duration != null && (
                      <span className="text-sm text-zinc-400">{duration} min</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-zinc-400">
                    {formatDate(workout.startedAt)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
