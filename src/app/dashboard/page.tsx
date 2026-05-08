import { format, parseISO } from "date-fns";
import { Clock, Dumbbell } from "lucide-react";
import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./DatePicker";

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
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DatePicker date={date} />
      </div>

      {workouts.length === 0 ? (
        <p className="text-zinc-400">No workouts logged for this day.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {workouts.map((workout) => {
            const duration =
              workout.endedAt ? getDuration(workout.startedAt, workout.endedAt) : null;
            return (
              <div
                key={workout.id}
                className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4 transition-colors hover:bg-zinc-800"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-white">{workout.name ?? "Untitled"}</span>
                  {duration !== null && (
                    <span className="flex items-center gap-1 text-sm text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {duration} min
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <span>
                    {format(workout.startedAt, "HH:mm")}
                    {workout.endedAt && ` – ${format(workout.endedAt, "HH:mm")}`}
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell className="h-3.5 w-3.5" />
                    {workout.exerciseCount} exercises
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
