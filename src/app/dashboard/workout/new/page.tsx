import { NewWorkoutForm } from "./NewWorkoutForm";

export default function NewWorkoutPage() {
  return (
    <div className="max-w-lg mx-auto px-6 pt-12">
      <h1 className="text-3xl font-bold mb-6">New Workout</h1>
      <NewWorkoutForm />
    </div>
  );
}
