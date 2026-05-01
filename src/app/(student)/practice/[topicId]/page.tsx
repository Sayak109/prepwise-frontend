"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PracticeSession } from "@/components/practice/practice-session";
import { startTopicPractice } from "@/services/student-api";

export default function PracticePage() {
  const params = useParams<{ topicId: string }>();
  const topicId = params.topicId;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["practice", topicId],
    queryFn: () => startTopicPractice(topicId),
    enabled: Boolean(topicId),
  });

  if (isLoading) {
    return <PracticeSession topicId={topicId} topicTitle="Loading practice..." questions={[]} />;
  }

  if (isError || !data) {
    return <PracticeSession topicId={topicId} topicTitle="Practice unavailable" questions={[]} />;
  }

  return <PracticeSession topicId={topicId} topicTitle={data.topic.title} questions={data.questions} />;
}
