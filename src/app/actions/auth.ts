"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, FLASH_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, USER_COOKIE } from "@/lib/constants";
import { serverApiUrl } from "@/lib/api-url";
import { decryptFromBackend, encryptForBackend } from "@/lib/server-crypto";
import type { AuthResponse, User } from "@/types";

type BackendEncryptedResponse = { data: string };
type BackendApiResponse<T> = { success: boolean; message: string; data: T };
export type AuthActionState = { error?: string };
type CheckUserResponse = {
  isRegistered: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isEditor: boolean;
};

function normalizeUser(user: any): User {
  return {
    id: user.id,
    name: user.name ?? [user.firstName, user.lastName].filter(Boolean).join(" ") ?? user.email,
    email: user.email,
    role: user.role,
    premium: Boolean(user.premium),
  };
}

export async function persistSession(auth: AuthResponse) {
  const cookieStore = await cookies();
  const options = {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  };

  cookieStore.set(AUTH_COOKIE, auth.token, options);
  cookieStore.set(REFRESH_COOKIE, auth.refreshToken, options);
  cookieStore.set(ROLE_COOKIE, auth.user.role, options);
  cookieStore.set(USER_COOKIE, JSON.stringify(auth.user), options);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(ROLE_COOKIE);
  cookieStore.delete(USER_COOKIE);
}

async function setFlashToast(type: "success" | "error", message: string) {
  const cookieStore = await cookies();
  cookieStore.set(FLASH_COOKIE, JSON.stringify({ type, message }), {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60,
  });
}

async function fetchCurrentUser(token: string) {
  const response = await axios.get<BackendApiResponse<any>>(serverApiUrl("/auth/me"), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return normalizeUser(response.data.data);
}

function getAxiosMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: unknown } | undefined;
    const message = data?.message;
    if (Array.isArray(message)) return message.map(String).join(", ");
    if (typeof message === "string" && message.trim()) return message;
  }
  return "Something went wrong. Please try again.";
}

async function checkUser(email: string) {
  const encryptedPayload = encryptForBackend({ email });
  const response = await axios.post<BackendEncryptedResponse>(serverApiUrl("/auth/check"), {
    data: encryptedPayload,
  });
  const check = decryptFromBackend<BackendApiResponse<CheckUserResponse>>(response.data.data);
  return check.data;
}

export async function loginAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  let check: CheckUserResponse;
  try {
    check = await checkUser(email);
  } catch (error) {
    return { error: getAxiosMessage(error) };
  }

  if (!check.isRegistered) {
    return { error: "Account not found. Please register first." };
  }

  const encryptedPayload = encryptForBackend({
    auth_method: "EMAIL_PW",
    email,
    password,
  });

  try {
    const response = await axios.post<BackendEncryptedResponse>(serverApiUrl("/auth/login"), {
      data: encryptedPayload,
    });
    const authResponse = decryptFromBackend<BackendApiResponse<{ accessToken: string; refreshToken: string }>>(response.data.data);
    const user = await fetchCurrentUser(authResponse.data.accessToken);

    await persistSession({
      token: authResponse.data.accessToken,
      refreshToken: authResponse.data.refreshToken,
      user,
    });
    await setFlashToast("success", "Login successful.");
  } catch (error) {
    return { error: getAxiosMessage(error) };
  }
  redirect("/dashboard");
}
export async function registerAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  let check: CheckUserResponse;
  try {
    check = await checkUser(email);
  } catch (error) {
    return { error: getAxiosMessage(error) };
  }

  if (check.isRegistered) {
    return { error: "Account already exists. Please login." };
  }

  const encryptedPayload = encryptForBackend({
    name,
    email,
    password,
    role: "STUDENT",
  });

  try {
    const response = await axios.post<BackendEncryptedResponse>(serverApiUrl("/auth/register"), {
      data: encryptedPayload,
    });
    const authResponse = decryptFromBackend<BackendApiResponse<{ accessToken: string; refreshToken: string }>>(response.data.data);
    const user = await fetchCurrentUser(authResponse.data.accessToken);

    await persistSession({
      token: authResponse.data.accessToken,
      refreshToken: authResponse.data.refreshToken,
      user,
    });
    await setFlashToast("success", "Account created successfully.");
  } catch (error) {
    return { error: getAxiosMessage(error) };
  }
  redirect("/dashboard");
}
export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (token) {
    try {
      await axios.post(
        serverApiUrl("/auth/logout"),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch {
      // Even if backend logout fails, clear local session.
    }
  }

  await clearAuthCookies();
  await setFlashToast("success", "Logged out successfully.");
  redirect("/topic");
}
