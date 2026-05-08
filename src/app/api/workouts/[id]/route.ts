import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts, sets } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(workout);
}
