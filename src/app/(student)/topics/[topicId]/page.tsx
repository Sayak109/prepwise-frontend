import Link from "next/link";
import axios from "axios";
import { notFound } from "next/navigation";
import { StudentLayout } from "@/components/layout/student-layout";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export default async function TopicDetailPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const response = await axios
    .get(`${API_URL}/practice/topics`, {
      params: { limit: 100, includeQuestions: false },
    })
    .catch(() => null);
  if (!response) notFound();
  const topic = response.data.data?.topics?.find((item: any) => item.id === topicId);
  if (!topic) notFound();

  return (
    <StudentLayout>
      <h2 className="text-2xl font-semibold">{topic.title}</h2>
      <p className="text-muted-foreground mb-4">{topic.description}</p>
      <Link
        className="inline-flex rounded-lg bg-[#1f108e] px-4 py-2 font-semibold text-white"
        href={`/practice/${topic.id}`}
      >
        Start Practice
      </Link>
    </StudentLayout>
  );
}
