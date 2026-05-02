import styles from "@/components/feedback/circular-loader.module.css";

type Size = "sm" | "md" | "lg";

const sizeClass: Record<Size, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

type CircularLoaderProps = {
  size?: Size;
  label?: string;
  className?: string;
  /** Row layout for use inside buttons */
  inline?: boolean;
  /** Light ring for purple / dark backgrounds */
  onPrimary?: boolean;
};

export function CircularLoader({ size = "md", label, className, inline, onPrimary }: CircularLoaderProps) {
  const aria = label ?? "Loading";
  const ringClass = [styles.ring, sizeClass[size], onPrimary ? styles.ringOnPrimary : ""].filter(Boolean).join(" ");
  return (
    <div
      className={[styles.wrap, inline ? styles.wrapInline : "", className].filter(Boolean).join(" ")}
      role="status"
      aria-live="polite"
      aria-label={aria}
    >
      <div className={ringClass} />
      {label && !inline ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
