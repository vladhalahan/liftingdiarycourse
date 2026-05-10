import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Lifting Diary</h1>
        <p className="text-muted-foreground">Track your lifting workouts</p>
      </div>
      <div className="flex gap-3">
        <SignInButton mode="modal">
          <Button variant="outline">Sign in</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button>Get started</Button>
        </SignUpButton>
      </div>
    </main>
  );
}
