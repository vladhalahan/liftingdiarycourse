"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().optional(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().optional(),
});

export async function createWorkoutAction(params: {
  name?: string;
  startedAt: Date;
  endedAt?: Date;
}) {
  const { name, startedAt, endedAt } = createWorkoutSchema.parse(params);
  await createWorkout(name, startedAt, endedAt);
}
