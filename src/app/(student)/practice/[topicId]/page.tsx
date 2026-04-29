import { StudentLayout } from "@/components/layout/student-layout";
import { fetchQuestionsByTopic, fetchTopicById } from "@/services/mock-api";
import { QuestionCard } from "@/components/questions/question-card";
export default async function PracticePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params; const topic = await fetchTopicById(topicId); const topicQuestions = await fetchQuestionsByTopic(topicId);
  return <StudentLayout><h2 className="text-2xl font-semibold mb-2">Practice: {topic?.title ?? topicId}</h2><p className="text-sm text-muted-foreground mb-4">Attempt and instantly review explanations.</p><div className="space-y-4">{topicQuestions.map((question) => <QuestionCard key={question.id} question={question} />)}</div></StudentLayout>;
}
