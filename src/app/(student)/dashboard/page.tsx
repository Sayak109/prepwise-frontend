import { StudentLayout } from "@/components/layout/student-layout";
import { attempts } from "@/data/attempts"; import { topics } from "@/data/topics"; import { tests } from "@/data/tests"; import { users } from "@/data/users";
import { LazyDashboardCharts } from "@/components/dashboard/lazy-dashboard-charts";
export default async function DashboardPage() {
  const activeUser = users.find((u) => u.role === "STUDENT")!; const recentAttempts = attempts.filter((a) => a.userId === activeUser.id).slice(-5);
  const accuracyData = topics.map((topic, index) => ({
    topic: topic.title.split(" ")[0],
    accuracy: 58 + (index * 7) % 38,
  }));
  const attemptsData = recentAttempts.map((a) => ({ name: a.createdAt.slice(5), score: Math.round((a.score / a.total) * 100) }));
  const weakTopics = topics.filter((t) => t.weakForUsers?.includes(activeUser.id));
  return <StudentLayout><section className="grid gap-4 md:grid-cols-3 mb-6"><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Total Tests</p><p className="text-2xl font-bold">{tests.length}</p></div><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Recent Attempts</p><p className="text-2xl font-bold">{recentAttempts.length}</p></div><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Average Accuracy</p><p className="text-2xl font-bold">{Math.round(recentAttempts.reduce((s, c) => s + c.accuracy, 0) / Math.max(recentAttempts.length, 1))}%</p></div></section><LazyDashboardCharts accuracyData={accuracyData} attemptsData={attemptsData} /><section className="mt-6 rounded-xl border p-4"><h3 className="font-semibold mb-2">Weak Topics Indicator</h3><ul className="list-disc ml-5 text-sm text-muted-foreground">{weakTopics.map((topic) => <li key={topic.id}>{topic.title}</li>)}</ul></section></StudentLayout>;
}
