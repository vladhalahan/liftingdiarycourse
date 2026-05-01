import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts, sets } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
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

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  const workout = await db.query.workouts.findFirst({
    where: eq(workouts.id, id),
    with: {
      exercises: {
        with: {
          sets: { orderBy: asc(sets.setNumber) },
        },
      },
    },
  });

  if (!workout || workout.userId !== userId) {
    notFound();
  }

  const duration = getDurationMinutes(workout.startedAt, workout.endedAt);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/" className="mb-6 inline-block text-sm text-zinc-400 hover:text-white">
        ← Back
      </Link>

      <h1 className="mb-1 text-2xl font-bold text-white">
        {workout.name ?? "Untitled Workout"}
      </h1>
      <p className="mb-8 text-sm text-zinc-400">
        {formatDate(workout.startedAt)}
        {duration != null && <span> · {duration} min</span>}
      </p>

      {workout.exercises.length === 0 ? (
        <p className="text-zinc-400">No exercises recorded.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {workout.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4"
            >
              <h2 className="mb-3 font-semibold text-white">{exercise.name}</h2>

              {exercise.sets.length === 0 ? (
                <p className="text-sm text-zinc-400">No sets recorded.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-zinc-400">
                      <th className="pb-2 font-medium">Set</th>
                      <th className="pb-2 font-medium">Weight (kg)</th>
                      <th className="pb-2 font-medium">Reps</th>
                      <th className="pb-2 font-medium">RPE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set) => (
                      <tr key={set.id} className="border-t border-zinc-800">
                        <td className="py-2 text-zinc-300">{set.setNumber}</td>
                        <td className="py-2 text-zinc-300">{set.weightKg ?? "—"}</td>
                        <td className="py-2 text-zinc-300">{set.reps ?? "—"}</td>
                        <td className="py-2 text-zinc-300">{set.rpe ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
