"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

export function DatePicker({ date }: { date: Date }) {
  const router = useRouter();

  return (
    <Calendar
      mode="single"
      selected={date}
      locale={enUS}
      onSelect={(d) => {
        if (d) {
          router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`);
          router.refresh();
        }
      }}
    />
  );
}
