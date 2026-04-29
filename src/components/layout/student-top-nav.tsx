"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
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
              pathname === item.href ||
              (item.href === "/tests" && pathname.startsWith("/test")) ||
              pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? styles.active : ""}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={styles.right}>{rightSlot}</div>
    </header>
  );
}
