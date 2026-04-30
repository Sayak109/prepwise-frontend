import { notFound } from "next/navigation";
import { fetchQuestionsByTopic, fetchTopicById } from "@/services/mock-api";
import { PracticeSession } from "@/components/practice/practice-session";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = await fetchTopicById(topicId);
  if (!topic) notFound();

  const topicQuestions = await fetchQuestionsByTopic(topicId);

  return (
    <PracticeSession topicTitle={topic.title} questions={topicQuestions} />
  );
}
