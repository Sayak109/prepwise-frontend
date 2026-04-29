import { notFound } from "next/navigation";
import { TestPlayer } from "@/components/test/test-player";
import { fetchQuestionsByIds, fetchTestById } from "@/services/mock-api";
export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params; const test = await fetchTestById(testId); if (!test) notFound(); const testQuestions = await fetchQuestionsByIds(test.questionIds);
  return <TestPlayer testId={test.id} testTitle={test.title} questions={testQuestions} durationMinutes={test.durationMinutes} />;
}
