import { NextResponse } from "next/server";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export function apiResponse<T>(data: T, message = "OK", status = 200, success = true) {
  return NextResponse.json({ success, message, data } satisfies ApiResponse<T>, { status });
}

export function apiError(error: unknown, fallback = "Something went wrong.", status = 400) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ success: false, message, data: null }, { status });
}

