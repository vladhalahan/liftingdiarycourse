import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dateParam = req.nextUrl.searchParams.get("date");

  const conditions = [eq(workouts.userId, userId)];

  if (dateParam) {
    const dayStart = new Date(`${dateParam}T00:00:00.000Z`);
    const dayEnd = new Date(`${dateParam}T00:00:00.000Z`);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);
    conditions.push(gte(workouts.startedAt, dayStart), lt(workouts.startedAt, dayEnd));
  }

  const result = await db
    .select()
    .from(workouts)
    .where(and(...conditions))
    .orderBy(desc(workouts.startedAt));

  return NextResponse.json(result);
}
