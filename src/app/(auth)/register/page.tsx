import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f2fc]">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full grid place-items-center">
          <RegisterForm />
          <p className="text-sm text-slate-600 mb-4">
            Already registered?{" "}
            <Link
              className="text-[#1f108e] font-semibold hover:underline"
              href="/login"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
