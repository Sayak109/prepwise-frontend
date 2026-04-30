import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f2fc]">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full grid place-items-center">
          <LoginForm />
          <p className="text-sm text-slate-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link className="text-[#1f108e] font-semibold hover:underline" href="/register">
              Create your account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
