export function ResultSummary({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  return <section className="rounded-xl border p-5 space-y-2 bg-card"><h3 className="text-lg font-semibold">Auto Result</h3><p>Score: {score}/{total}</p><p>Accuracy: {pct}%</p></section>;
}
