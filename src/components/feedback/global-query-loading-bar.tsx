"use client";

import { useIsFetching } from "@tanstack/react-query";
import styles from "@/components/feedback/global-query-loading-bar.module.css";

/** Thin top bar while any React Query request is in flight. */
export function GlobalQueryLoadingBar() {
  const count = useIsFetching();
  if (count === 0) return null;
  return <div className={styles.bar} role="progressbar" aria-hidden />;
}
