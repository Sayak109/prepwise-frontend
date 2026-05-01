import { AppFooter } from "@/components/layout/app-footer";
import { StudentTopNav } from "@/components/layout/student-top-nav";
import { fetchTestAttempt } from "@/services/server-student-api";
import { TestResultsView } from "@/components/test/test-results-view";

export default async function TestResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { testId } = await params;
  const query = await searchParams;

  const attemptId = String(query.attemptId ?? "");
  if (!attemptId) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fcf8ff] text-[#1b1b22] font-sans">
        <StudentTopNav subtitle="Results" />
        <main className="flex-1 mx-auto max-w-4xl px-4 py-10">
          <p className="text-[#464553]">Result is unavailable. Missing attempt id.</p>
        </main>
        <AppFooter />
      </div>
    );
  }

  const attempt = await fetchTestAttempt(attemptId);
  const score = Number(attempt.score ?? 0);
  const total = Number(attempt.summary?.totalQuestions ?? attempt.questions?.length ?? 0);
  const answered = Number(attempt.summary?.answered ?? 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8ff] text-[#1b1b22] font-sans">
      <StudentTopNav subtitle="Results" />
      <TestResultsView
        testId={testId}
        testTitle={attempt.test?.title ?? "Mock test"}
        score={score}
        totalQuestions={total}
        answered={answered}
        questions={attempt.questions as any}
      />
      <AppFooter />
    </div>
  );
}
