"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateWorkoutAction } from "./actions";

interface Props {
  workout: {
    id: string;
    name: string | null;
    startedAt: Date;
    endedAt: Date | null;
  };
  onSuccess?: () => void;
}

export function EditWorkoutForm({ workout, onSuccess }: Props) {
  const router = useRouter();
  const [name, setName] = useState(workout.name ?? "");
  const [date, setDate] = useState<Date>(workout.startedAt);
  const [startTime, setStartTime] = useState(
    format(workout.startedAt, "HH:mm")
  );
  const [endTime, setEndTime] = useState(
    workout.endedAt ? format(workout.endedAt, "HH:mm") : ""
  );
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const startedAt = new Date(date);
    startedAt.setHours(startHours, startMinutes, 0, 0);

    let endedAt: Date | undefined;
    if (endTime) {
      const [endHours, endMinutes] = endTime.split(":").map(Number);
      endedAt = new Date(date);
      endedAt.setHours(endHours, endMinutes, 0, 0);
    }

    await updateWorkoutAction({ id: workout.id, name: name || undefined, startedAt, endedAt });
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-1">
          <div className="space-y-2">
            <Label htmlFor="name">Workout name (optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Push Day"
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2 font-normal">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  {format(date, "do MMM yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  locale={enUS}
                  onSelect={(d) => {
                    if (d) setDate(d);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End time (optional)</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save changes"}
          </Button>
        </form>
  );
}
