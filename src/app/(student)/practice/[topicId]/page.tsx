"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FetchLoadingBlock } from "@/components/feedback/fetch-loading-block";
import { AppFooter } from "@/components/layout/app-footer";
import { StudentTopNav } from "@/components/layout/student-top-nav";
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
    return (
      <div className="min-h-screen flex flex-col bg-[#fcf8ff]">
        <StudentTopNav />
        <FetchLoadingBlock message="Loading practice…" className="flex-1" />
        <AppFooter />
      </div>
    );
  }

  if (isError || !data) {
    return <PracticeSession topicId={topicId} topicTitle="Practice unavailable" questions={[]} />;
  }

  return <PracticeSession topicId={topicId} topicTitle={data.topic.title} questions={data.questions} />;
}
