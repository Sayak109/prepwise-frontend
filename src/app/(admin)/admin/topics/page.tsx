import { AdminLayout } from "@/components/layout/admin-layout";
import { createTopicAction } from "@/app/actions/admin";
import { topics } from "@/data/topics";
import { Button } from "@/components/ui/button";
export default function AdminTopicsPage() {
  return <AdminLayout><h2 className="text-2xl font-semibold mb-4">Create / Manage Topics</h2><form action={createTopicAction} className="rounded-xl border p-4 bg-card space-y-3 mb-6"><input name="title" placeholder="Topic title" className="w-full rounded-md border px-3 py-2" required /><textarea name="description" placeholder="Topic description" className="w-full rounded-md border px-3 py-2" rows={3} required /><Button type="submit">Create Topic</Button></form><div className="grid gap-3 md:grid-cols-2">{topics.map((topic) => <article key={topic.id} className="rounded-xl border p-4"><h3 className="font-medium">{topic.title}</h3><p className="text-sm text-muted-foreground">Premium: {topic.premium ? "Yes" : "No"}</p></article>)}</div></AdminLayout>;
}
