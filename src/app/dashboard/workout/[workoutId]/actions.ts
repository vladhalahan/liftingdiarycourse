"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().optional(),
});

export async function updateWorkoutAction(params: {
  id: string;
  name?: string;
  startedAt: Date;
  endedAt?: Date;
}) {
  const { id, name, startedAt, endedAt } = updateWorkoutSchema.parse(params);
  await updateWorkout(id, name, startedAt, endedAt);
}
