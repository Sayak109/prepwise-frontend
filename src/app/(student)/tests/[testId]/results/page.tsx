import Link from "next/link";
import { AppFooter } from "@/components/layout/app-footer";

export default async function TestResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { testId } = await params;
  const query = await searchParams;

  const score = Number(query.score ?? 0);
  const total = Number(query.total ?? 0);
  const accuracy = Number(query.accuracy ?? 0);
  const answered = Number(query.answered ?? 0);
  const attempted = `${answered}/${total}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8ff] text-[#1b1b22] font-sans">
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-xs uppercase tracking-[0.08em] font-semibold text-[#1f108e] mb-2">
          Test Submitted
        </p>
        <h1 className="text-4xl font-bold mb-2">Result: Test submitted</h1>
        <p className="text-[#464553] mb-8">
          Your score has been calculated from the answers submitted in this attempt.
        </p>

        <section className="grid gap-4 md:grid-cols-4 mb-6">
          <article className="rounded-xl border border-[#c8c4d5] bg-white p-4">
            <p className="text-xs text-[#464553] uppercase tracking-[0.06em]">Score</p>
            <p className="text-3xl font-bold text-[#1f108e]">{score}</p>
          </article>
          <article className="rounded-xl border border-[#c8c4d5] bg-white p-4">
            <p className="text-xs text-[#464553] uppercase tracking-[0.06em]">Total</p>
            <p className="text-3xl font-bold text-[#1f108e]">{total}</p>
          </article>
          <article className="rounded-xl border border-[#c8c4d5] bg-white p-4">
            <p className="text-xs text-[#464553] uppercase tracking-[0.06em]">Accuracy</p>
            <p className="text-3xl font-bold text-[#1f108e]">{accuracy}%</p>
          </article>
          <article className="rounded-xl border border-[#c8c4d5] bg-white p-4">
            <p className="text-xs text-[#464553] uppercase tracking-[0.06em]">Attempted</p>
            <p className="text-3xl font-bold text-[#1f108e]">{attempted}</p>
          </article>
        </section>

        <section className="rounded-xl border border-[#c8c4d5] bg-white p-6 mb-6">
          <div className="h-4 w-full rounded-full bg-[#f0ecf6] overflow-hidden">
            <div className="h-full bg-[#1f108e]" style={{ width: `${accuracy}%` }} />
          </div>
          <p className="text-sm text-[#464553] mt-3">
            Performance band:{" "}
            <span className="font-semibold text-[#1b1b22]">
              {accuracy >= 85
                ? "Excellent"
                : accuracy >= 70
                  ? "Good"
                  : accuracy >= 50
                    ? "Needs Improvement"
                    : "Focus Required"}
            </span>
          </p>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/tests/${testId}`}
            className="rounded-lg border border-[#1f108e] text-[#1f108e] px-4 py-2 font-medium hover:bg-[#efecff]"
          >
            Retake Test
          </Link>
          <Link
            href="/tests"
            className="rounded-lg bg-[#1f108e] text-white px-4 py-2 font-medium hover:opacity-95"
          >
            Back to Exams
          </Link>
          <Link
            href="/results"
            className="rounded-lg border border-[#c8c4d5] text-[#1b1b22] px-4 py-2 font-medium hover:bg-[#f6f2fc]"
          >
            Open Full Results Dashboard
          </Link>
        </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
