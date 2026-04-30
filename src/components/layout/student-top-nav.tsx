"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bell, CircleHelp, Settings } from "lucide-react";
import styles from "@/components/layout/student-top-nav.module.css";

const menu = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/topics", label: "Topics" },
  { href: "/tests", label: "Mock test" },
  { href: "/results", label: "Results" },
];

export function StudentTopNav({
  subtitle,
  rightSlot,
}: {
  subtitle?: string;
  rightSlot?: ReactNode;
}) {
  const pathname = usePathname();

  const defaultRight = (
    <>
      <button className={styles.proButton} type="button">
        Upgrade Pro
      </button>
      <div className={styles.iconGroup}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Help">
          <CircleHelp size={18} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Settings">
          <Settings size={18} />
        </button>
      </div>
      <div className={styles.avatar} aria-label="Profile" />
    </>
  );

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link href="/dashboard" className={styles.brand}>
          PrepWise
        </Link>
        {subtitle ? (
          <>
            <span className={styles.separator} />
            <p className={styles.subtitle}>{subtitle}</p>
          </>
        ) : null}
        <nav className={styles.nav}>
          {menu.map((item) => {
            const active =
              (item.href === "/dashboard" && pathname.startsWith("/dashboard")) ||
              (item.href === "/topics" && (pathname.startsWith("/topics") || pathname.startsWith("/practice"))) ||
              (item.href === "/tests" &&
                (pathname.startsWith("/tests") || pathname.startsWith("/test"))) ||
              (item.href === "/results" &&
                (pathname.startsWith("/results") || pathname.includes("/results"))) ||
              pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={active ? styles.active : ""}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={styles.right}>{rightSlot ?? defaultRight}</div>
    </header>
  );
}
