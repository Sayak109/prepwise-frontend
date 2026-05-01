import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

const protectedStudentPaths = ["/dashboard", "/tests", "/results"];

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
  matcher: ["/dashboard/:path*", "/tests/:path*", "/results/:path*", "/practice/:path*"],
};
