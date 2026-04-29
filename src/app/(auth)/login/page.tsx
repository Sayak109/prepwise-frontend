import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="space-y-3 w-full grid place-items-center">
        <LoginForm />
        <p className="text-sm">
          No account?{" "}
          <Link className="underline" href="/register">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
