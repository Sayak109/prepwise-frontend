import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
export default function RegisterPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="space-y-3 w-full grid place-items-center">
        <RegisterForm />
        <p className="text-sm">
          Already registered?{" "}
          <Link className="underline" href="/login">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
