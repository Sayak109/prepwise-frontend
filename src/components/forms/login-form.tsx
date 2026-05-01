"use client";

import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { loginAction } from "@/app/actions/auth";

function GoogleIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      className="w-5 h-5 fill-current"
      viewBox="0 0 384 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state.error]);

  return (
    <div className="w-full max-w-[440px] px-8 py-8">
      <div className="text-center mb-6">
        <div className="text-3xl font-extrabold tracking-tight text-[#1f108e] mb-1">
          PrepWise
        </div>
        <h1 className="text-4xl font-bold text-[#1b1b22]">Log in</h1>
      </div>

      <div className="space-y-2.5 mb-5">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg text-[#1b1b22] font-medium hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg text-[#1b1b22] font-medium hover:bg-slate-50 transition-all duration-200 shadow-sm"
        >
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      <div className="relative flex items-center my-6">
        <div className="flex-grow border-t border-slate-300" />
        <span className="flex-shrink mx-4 text-xs font-bold tracking-widest text-slate-500">
          OR
        </span>
        <div className="flex-grow border-t border-slate-300" />
      </div>

      <form action={formAction} className="space-y-4.5">
        <div>
          <label
            className="block text-xs font-bold tracking-widest text-[#464553] mb-2"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            placeholder="name@company.com"
            type="email"
            required
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1f108e] focus:border-[#1f108e] outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label
            className="block text-xs font-bold tracking-widest text-[#464553] mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            placeholder="Password"
            type="password"
            required
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#1f108e] focus:border-[#1f108e] outline-none transition-all duration-200"
          />
        </div>

        <button
          className="w-full bg-[#1f108e] text-white py-3.5 rounded-lg hover:bg-[#3730a3] transition-all duration-200 shadow-sm active:scale-[0.98] font-semibold"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
