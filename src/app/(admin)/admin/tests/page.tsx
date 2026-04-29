import { AdminLayout } from "@/components/layout/admin-layout";
import { createTestAction } from "@/app/actions/admin";
import { tests } from "@/data/tests";
import { Button } from "@/components/ui/button";
export default function AdminTestsPage() {
  return <AdminLayout><h2 className="text-2xl font-semibold mb-4">Create Tests / Set Timer</h2><form action={createTestAction} className="rounded-xl border p-4 bg-card space-y-3 mb-6"><input name="title" placeholder="Test title" className="w-full rounded-md border px-3 py-2" required /><input name="timer" type="number" defaultValue={30} className="w-full rounded-md border px-3 py-2" required /><label className="text-sm flex items-center gap-2"><input type="checkbox" name="premium" /> Mark premium content</label><Button type="submit">Create Test</Button></form><div className="space-y-3">{tests.map((test) => <article key={test.id} className="rounded-xl border p-4"><h3 className="font-medium">{test.title}</h3><p className="text-sm text-muted-foreground">Timer: {test.durationMinutes} min | Premium: {test.premium ? "Yes" : "No"}</p></article>)}</div></AdminLayout>;
}
