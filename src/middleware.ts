import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, PUBLIC_PATHS, ROLE_COOKIE } from "@/lib/constants";
import { roleCanAccessPath, roleHome } from "@/lib/route-access";
import { Role } from "@/types";
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; const token = req.cookies.get(AUTH_COOKIE)?.value; const role = req.cookies.get(ROLE_COOKIE)?.value as Role | undefined;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!token && !isPublic) return NextResponse.redirect(new URL("/login", req.url));
  if (token && isPublic) return NextResponse.redirect(new URL(role ? roleHome[role] : "/dashboard", req.url));
  if (token && !roleCanAccessPath(role, pathname)) return NextResponse.redirect(new URL(role ? roleHome[role] : "/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
