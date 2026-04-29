import { notFound } from "next/navigation";
import { StudentLayout } from "@/components/layout/student-layout";
import { fetchQuestionsByTopic, fetchTopicById } from "@/services/mock-api";
import { QuestionCard } from "@/components/questions/question-card";
export default async function TopicDetailPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params; const topic = await fetchTopicById(topicId); if (!topic) notFound(); const topicQuestions = await fetchQuestionsByTopic(topicId);
  return <StudentLayout><h2 className="text-2xl font-semibold">{topic.title}</h2><p className="text-muted-foreground mb-4">{topic.description}</p><div className="space-y-4">{topicQuestions.map((question) => <QuestionCard key={question.id} question={question} />)}</div></StudentLayout>;
}
