import { EditorLayout } from "@/components/layout/editor-layout";
import { topics } from "@/data/topics";
export default function EditorHomePage() {
  return <EditorLayout><h2 className="text-2xl font-semibold mb-4">Editor Home</h2><p className="text-sm text-muted-foreground mb-4">Editors can create and update questions for assigned topics only.</p><div className="grid gap-3 md:grid-cols-2">{topics.map((topic) => <article key={topic.id} className="rounded-xl border p-4"><h3 className="font-medium">{topic.title}</h3><p className="text-sm text-muted-foreground">Assigned Editors: {topic.editorIds.join(", ")}</p></article>)}</div></EditorLayout>;
}
