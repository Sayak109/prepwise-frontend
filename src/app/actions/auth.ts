"use server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  // Auth disabled: keep page for future backend wiring.
  void formData;
  redirect("/dashboard");
}
export async function registerAction(formData: FormData) {
  // Auth disabled: keep page for future backend wiring.
  void formData;
  redirect("/dashboard");
}
export async function logoutAction() {
  redirect("/dashboard");
}
