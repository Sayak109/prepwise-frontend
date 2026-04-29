import { cookies } from "next/headers";
import { AUTH_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, USER_COOKIE } from "@/lib/constants";
import { Role } from "@/types";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const role = cookieStore.get(ROLE_COOKIE)?.value as Role | undefined;
  const user = cookieStore.get(USER_COOKIE)?.value;
  return { token, refreshToken, role, user: user ? JSON.parse(user) : null, isAuthenticated: Boolean(token) };
}
