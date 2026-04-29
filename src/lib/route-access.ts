import { Role } from "@/types";

export const roleHome: Record<Role, string> = { ADMIN: "/admin", EDITOR: "/editor", STUDENT: "/dashboard" };

export function roleCanAccessPath(role: Role | undefined, pathname: string) {
  if (!role) return false;
  if (pathname.startsWith("/admin")) return role === "ADMIN";
  if (pathname.startsWith("/editor")) return role === "EDITOR";
  if (["/dashboard", "/topics", "/practice", "/tests", "/results"].some((segment) => pathname.startsWith(segment))) {
    return role === "STUDENT" || role === "ADMIN" || role === "EDITOR";
  }
  return true;
}
