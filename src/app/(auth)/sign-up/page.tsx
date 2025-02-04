import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary/10 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignUpForm />
      </div>
    </div>
  );
}
