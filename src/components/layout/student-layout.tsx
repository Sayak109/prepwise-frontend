import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
export function StudentLayout({ children }: { children: ReactNode }) {
  return <AppShell studentNav>{children}</AppShell>;
}
