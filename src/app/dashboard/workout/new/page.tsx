import Link from "next/link";
import { NewWorkoutForm } from "./NewWorkoutForm";
import { Card } from "@/components/ui/card";

export default function NewWorkoutPage() {
  return (
    <div className="max-w-lg mx-auto px-6 pt-12">
      <Link href="/dashboard" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-6">New Workout</h1>
      <Card className="p-6">
        <NewWorkoutForm />
      </Card>
    </div>
  );
}
