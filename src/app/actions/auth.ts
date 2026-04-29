"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mockLogin, mockRegister } from "@/services/auth-service";
import { AUTH_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, USER_COOKIE } from "@/lib/constants";
import { Role } from "@/types";
export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const user = await mockLogin(email);
  const c = await cookies();
  c.set(AUTH_COOKIE, user.token, { httpOnly: true }); c.set(REFRESH_COOKIE, user.refreshToken, { httpOnly: true }); c.set(ROLE_COOKIE, user.user.role, { httpOnly: true }); c.set(USER_COOKIE, JSON.stringify(user.user), { httpOnly: true });
  if (user.user.role === "ADMIN") redirect("/admin");
  if (user.user.role === "EDITOR") redirect("/editor");
  redirect("/dashboard");
}
export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? ""); const email = String(formData.get("email") ?? ""); const role = String(formData.get("role") ?? "STUDENT") as Role;
  const user = await mockRegister(name, email, role); const c = await cookies();
  c.set(AUTH_COOKIE, user.token, { httpOnly: true }); c.set(REFRESH_COOKIE, user.refreshToken, { httpOnly: true }); c.set(ROLE_COOKIE, user.user.role, { httpOnly: true }); c.set(USER_COOKIE, JSON.stringify(user.user), { httpOnly: true });
  redirect("/dashboard");
}
export async function logoutAction() { const c = await cookies(); c.delete(AUTH_COOKIE); c.delete(REFRESH_COOKIE); c.delete(ROLE_COOKIE); c.delete(USER_COOKIE); redirect("/login"); }
