import { format, parseISO } from "date-fns";
import { Clock, Dumbbell } from "lucide-react";
import Link from "next/link";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./DatePicker";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getDuration(startedAt: Date, endedAt: Date) {
  return Math.round((endedAt.getTime() - startedAt.getTime()) / 60000);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const dateStr = dateParam ?? format(new Date(), "yyyy-MM-dd");
  const date = parseISO(dateStr);

  const workouts = await getWorkoutsByDate(dateStr);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Workout Dashboard</h1>

      <div className="grid grid-cols-[30%_70%] gap-8">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Select Date</h2>
          <Card className="p-4 self-start">
            <DatePicker date={date} />
          </Card>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Workouts for {format(date, "do MMM yyyy")}
            </h2>
            <Button asChild size="sm">
              <Link href="/dashboard/workout/new">Log New Workout</Link>
            </Button>
          </div>
          <Card className="p-6">
            {workouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <p className="text-muted-foreground">No workouts logged for this date</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {workouts.map((workout) => {
                  const duration =
                    workout.endedAt
                      ? getDuration(workout.startedAt, workout.endedAt)
                      : null;
                  return (
                    <div
                      key={workout.id}
                      className="flex items-center rounded-lg border transition-colors hover:bg-muted"
                    >
                      <Link
                        href={`/workouts/${workout.id}`}
                        className="flex-1 px-5 py-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold">
                            {workout.name ?? "Untitled"}
                          </span>
                          {duration !== null && (
                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {duration} min
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            {format(workout.startedAt, "HH:mm")}
                            {workout.endedAt &&
                              ` – ${format(workout.endedAt, "HH:mm")}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <Dumbbell className="h-3.5 w-3.5" />
                            {workout.exerciseCount} exercises
                          </span>
                        </div>
                      </Link>
                      <div className="pr-4">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/workout/${workout.id}`}>Edit</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
