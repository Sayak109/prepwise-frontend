"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FLASH_COOKIE } from "@/lib/constants";

type FlashMessage = {
  type: "success" | "error";
  message: string;
};

function readCookie(name: string) {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
  return value ? decodeURIComponent(value) : null;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export function ToastProvider() {
  useEffect(() => {
    const raw = readCookie(FLASH_COOKIE);
    if (!raw) return;

    clearCookie(FLASH_COOKIE);
    try {
      const flash = JSON.parse(raw) as FlashMessage;
      if (flash.type === "success") {
        toast.success(flash.message);
      } else {
        toast.error(flash.message);
      }
    } catch {
      toast(raw);
    }
  }, []);

  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "8px",
          border: "1px solid #d8d3e6",
          color: "#1b1b22",
          fontSize: "14px",
          fontWeight: 600,
          padding: "12px 14px",
        },
        success: {
          iconTheme: {
            primary: "#1f108e",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#b42318",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
