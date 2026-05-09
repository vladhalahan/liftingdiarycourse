import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts, exercises } from "@/db/schema";
import { and, eq, gte, lt, count, desc } from "drizzle-orm";

export async function getWorkoutById(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}

export async function updateWorkout(
  id: string,
  name: string | undefined,
  startedAt: Date,
  endedAt: Date | undefined
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .update(workouts)
    .set({ name, startedAt, endedAt })
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}

export async function createWorkout(name: string | undefined, startedAt: Date, endedAt?: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.insert(workouts).values({ userId, name, startedAt, endedAt });
}

export async function getWorkoutsByDate(date: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dayStart = new Date(`${date}T00:00:00.000Z`);
  const dayEnd = new Date(`${date}T00:00:00.000Z`);
  dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

  return db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
      endedAt: workouts.endedAt,
      exerciseCount: count(exercises.id),
    })
    .from(workouts)
    .leftJoin(exercises, eq(exercises.workoutId, workouts.id))
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.startedAt, dayStart),
        lt(workouts.startedAt, dayEnd)
      )
    )
    .groupBy(workouts.id)
    .orderBy(desc(workouts.startedAt));
}
