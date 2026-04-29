import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
export function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell
      title="PrepWise Editor"
      nav={[
        { href: "/editor", label: "Editor Home" },
        { href: "/editor/questions", label: "Question Bank" },
        { href: "/topics", label: "Topics" },
      ]}
    >
      {children}
    </AppShell>
  );
}
