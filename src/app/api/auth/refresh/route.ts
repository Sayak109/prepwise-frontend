import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverApiUrl } from "@/lib/api-url";
import { AUTH_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, USER_COOKIE } from "@/lib/constants";
import { decryptFromBackend } from "@/lib/server-crypto";
import { clearAuthCookies, persistSession } from "@/app/actions/auth";
import type { User } from "@/types";

type BackendEncryptedResponse = { data: string };
type BackendApiResponse<T> = { success: boolean; message: string; data: T };

function normalizeUser(user: any): User {
  return {
    id: user.id,
    name: user.name ?? [user.firstName, user.lastName].filter(Boolean).join(" ") ?? user.email,
    email: user.email,
    role: user.role,
    premium: Boolean(user.premium),
  };
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    await clearAuthCookies();
    return NextResponse.json({ message: "Refresh token missing" }, { status: 401 });
  }

  try {
    const response = await axios.post<BackendEncryptedResponse>(serverApiUrl("/auth/refresh"), {
      data: refreshToken,
    });
    const authResponse = decryptFromBackend<BackendApiResponse<{ accessToken: string; refreshToken: string }>>(
      response.data.data,
    );

    const me = await axios.get<BackendApiResponse<any>>(serverApiUrl("/auth/me"), {
      headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
    });
    const user = normalizeUser(me.data.data);

    await persistSession({
      token: authResponse.data.accessToken,
      refreshToken: authResponse.data.refreshToken,
      user,
    });

    return NextResponse.json({ success: true });
  } catch {
    cookieStore.delete(AUTH_COOKIE);
    cookieStore.delete(REFRESH_COOKIE);
    cookieStore.delete(ROLE_COOKIE);
    cookieStore.delete(USER_COOKIE);
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }
}
