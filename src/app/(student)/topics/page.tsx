"use client";
import Link from "next/link";
import { StudentLayout } from "@/components/layout/student-layout";
import { useTopics } from "@/hooks/use-topics";
export default function TopicsPage() {
  const { data, isLoading } = useTopics();
  return <StudentLayout><h2 className="text-2xl font-semibold mb-4">Topics</h2>{isLoading ? <p>Loading topics...</p> : null}<div className="grid gap-4 md:grid-cols-2">{data?.map((topic) => <article key={topic.id} className="rounded-xl border p-4 bg-card"><h3 className="font-medium">{topic.title}</h3><p className="text-sm text-muted-foreground my-2">{topic.description}</p><div className="flex gap-2"><Link className="underline text-sm" href={`/topics/${topic.id}`}>Open</Link><Link className="underline text-sm" href={`/practice/${topic.id}`}>Practice</Link></div></article>)}</div></StudentLayout>;
}
