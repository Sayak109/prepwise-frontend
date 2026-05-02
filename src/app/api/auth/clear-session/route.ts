import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE,
  FLASH_COOKIE,
  REFRESH_COOKIE,
  ROLE_COOKIE,
  USER_COOKIE,
} from "@/lib/constants";

function loginDestination(request: NextRequest, nextParam: string | null): URL {
  const base = request.nextUrl.origin;
  if (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")) {
    return new URL(nextParam, base);
  }
  return new URL("/login", base);
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(ROLE_COOKIE);
  cookieStore.delete(USER_COOKIE);
  cookieStore.set(FLASH_COOKIE, JSON.stringify({ type: "error", message: "Session expired. Please login again." }), {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60,
  });
  const next = request.nextUrl.searchParams.get("next");
  return NextResponse.redirect(loginDestination(request, next));
}
