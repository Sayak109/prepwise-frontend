import { createQuestionAction } from "@/app/actions/editor";
import { EditorLayout } from "@/components/layout/editor-layout";
import { questions } from "@/data/questions";
import { topics } from "@/data/topics";
import { Button } from "@/components/ui/button";
export default function EditorQuestionsPage() {
  return <EditorLayout><h2 className="text-2xl font-semibold mb-4">Create / Edit Questions</h2><form action={createQuestionAction} className="rounded-xl border p-4 bg-card space-y-3 mb-6"><select name="topicId" className="w-full rounded-md border px-3 py-2">{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select><select name="type" className="w-full rounded-md border px-3 py-2"><option value="MCQ">MCQ</option><option value="SHORT_ANSWER">SHORT_ANSWER</option><option value="DESCRIPTIVE">DESCRIPTIVE</option></select><textarea name="prompt" placeholder="Question prompt" className="w-full rounded-md border px-3 py-2" rows={3} required /><Button type="submit">Save Question</Button></form><div className="space-y-3">{questions.map((question) => <article key={question.id} className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">{question.type}</p><h3 className="font-medium">{question.prompt}</h3></article>)}</div></EditorLayout>;
}
