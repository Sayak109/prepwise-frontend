import Link from "next/link";
import { ReactNode } from "react";
import { AppFooter } from "@/components/layout/app-footer";
import { StudentTopNav } from "@/components/layout/student-top-nav";
interface AppShellProps {
  children: ReactNode;
  title?: string;
  nav?: { href: string; label: string }[];
  studentNav?: boolean;
}
export function AppShell({ children, title, nav, studentNav }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {studentNav ? (
        <StudentTopNav />
      ) : (
        <header className="border-b bg-background/90 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-semibold">{title}</h1>
            <nav className="flex flex-wrap gap-2 text-sm">
              {nav?.map((item) => (
                <Link key={item.href} className="px-3 py-1.5 rounded-md border hover:bg-muted" href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
      )}
      <main className="mx-auto w-full max-w-6xl px-4 py-6 flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
