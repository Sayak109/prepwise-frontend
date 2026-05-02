import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

const protectedStudentPaths = ["/dashboard", "/tests", "/test", "/results", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth =
    protectedStudentPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
    pathname.startsWith("/practice/");

  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (token) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // List exact paths separately: `/tests/:path*` does not always run middleware for `/tests` alone.
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/tests",
    "/tests/:path*",
    "/test",
    "/test/:path*",
    "/results",
    "/results/:path*",
    "/practice/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
