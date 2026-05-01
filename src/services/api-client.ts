import axios from "axios";
import { AUTH_COOKIE, FLASH_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, USER_COOKIE } from "@/lib/constants";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true,
});
let refreshing = false;
let queue: Array<() => void> = [];

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
  return value ? decodeURIComponent(value) : null;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

function clearSessionAndRedirect() {
  clearCookie(AUTH_COOKIE);
  clearCookie(REFRESH_COOKIE);
  clearCookie(ROLE_COOKIE);
  clearCookie(USER_COOKIE);
  if (typeof document !== "undefined") {
    document.cookie = `${FLASH_COOKIE}=${encodeURIComponent(
      JSON.stringify({ type: "error", message: "Session expired. Please login again." }),
    )}; Max-Age=60; path=/`;
  }
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

api.interceptors.request.use((config) => {
  const token = readCookie("prepwise_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error?.response?.status !== 401 || original?._retry) return Promise.reject(error);
    original._retry = true;
    if (refreshing) {
      await new Promise<void>((resolve) => queue.push(resolve));
      return api(original);
    }
    refreshing = true;
    try {
      await axios.post("/api/auth/refresh", undefined, { withCredentials: true });
      queue.forEach((resolve) => resolve());
      queue = [];
      return api(original);
    } catch (refreshError) {
      queue.forEach((resolve) => resolve());
      queue = [];
      clearSessionAndRedirect();
      return Promise.reject(refreshError);
    } finally {
      refreshing = false;
    }
  }
);

export default api;
