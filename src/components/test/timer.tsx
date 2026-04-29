"use client";
import { useEffect, useState } from "react";
export function Timer({
  initialSeconds,
  onEnd,
  compact = false,
}: {
  initialSeconds: number;
  onEnd: () => void;
  compact?: boolean;
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  useEffect(() => { if (secondsLeft <= 0) { onEnd(); return; } const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000); return () => clearInterval(id); }, [secondsLeft, onEnd]);
  const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const s = (secondsLeft % 60).toString().padStart(2, "0");
  if (compact) return <span className="font-mono text-lg">{m}:{s}</span>;
  return <div className="rounded-md border px-3 py-1 text-sm font-medium">Time Left: {m}:{s}</div>;
}
