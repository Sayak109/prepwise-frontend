import { Question } from "@/types";
import { MCQRenderer } from "@/components/questions/mcq-renderer";
import { ShortAnswerRenderer } from "@/components/questions/short-answer-renderer";
import { DescriptiveRenderer } from "@/components/questions/descriptive-renderer";
export function QuestionCard({ question }: { question: Question }) {
  return <article className="rounded-xl border p-4 space-y-3 bg-card"><p className="text-xs text-muted-foreground">{question.type}</p><h3 className="font-medium">{question.prompt}</h3>{question.type === "MCQ" ? <MCQRenderer question={question} /> : null}{question.type === "SHORT_ANSWER" ? <ShortAnswerRenderer question={question} /> : null}{question.type === "DESCRIPTIVE" ? <DescriptiveRenderer question={question} /> : null}</article>;
}
