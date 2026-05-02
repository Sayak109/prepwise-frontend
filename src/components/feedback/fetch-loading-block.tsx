import { CircularLoader } from "@/components/feedback/circular-loader";

type FetchLoadingBlockProps = {
  message: string;
  className?: string;
};

/** Centered block for list/page data fetching (matches PrepWise theme). */
export function FetchLoadingBlock({ message, className }: FetchLoadingBlockProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center gap-4 py-16 px-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <CircularLoader size="lg" />
      <p className="text-sm font-semibold text-[#464553]">{message}</p>
    </div>
  );
}
