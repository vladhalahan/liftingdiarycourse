import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./EditWorkoutForm";
import { Card } from "@/components/ui/card";

interface Props {
  params: Promise<{ workoutId: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params;
  const workout = await getWorkoutById(workoutId);

  if (!workout) notFound();

  return (
    <div className="max-w-lg mx-auto px-6 pt-12">
      <Link href="/dashboard" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Workout</h1>
      <Card className="p-6">
        <EditWorkoutForm workout={workout} />
      </Card>
    </div>
  );
}
