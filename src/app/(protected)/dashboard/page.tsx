import MultiStepForm from "@/components/multi-step-form";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function Dashboard() {
  const session = await auth();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <SignOutButton />
      <h1>Welcome, {session?.user.email}</h1>

      <MultiStepForm />
    </div>
  );
}
