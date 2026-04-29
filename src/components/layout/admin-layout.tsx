import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="PrepWise Admin"
      nav={[
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/user", label: "Users" },
        { href: "/admin/topics", label: "Topics" },
        { href: "/admin/tests", label: "Tests" },
      ]}
    >
      {children}
    </AppShell>
  );
}
