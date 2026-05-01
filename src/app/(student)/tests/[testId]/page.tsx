"use client";

import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { TestPlayer } from "@/components/test/test-player";
import { mapQuestion, startTest, type TestAttempt } from "@/services/student-api";
import { useEffect, useState } from "react";

export default function TestPage() {
  const params = useParams<{ testId: string }>();
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const mutation = useMutation({
    mutationFn: () => startTest(params.testId),
    onSuccess: setAttempt,
  });

  useEffect(() => {
    if (!params.testId || attempt || mutation.isPending) return;
    mutation.mutate();
  }, [attempt, mutation, params.testId]);

  if (mutation.isPending || !attempt) {
    return (
      <TestPlayer
        testId={params.testId}
        testTitle="Starting test..."
        attemptId=""
        questions={[]}
        durationMinutes={1}
      />
    );
  }

  const durationMinutes = Math.max(1, Math.round((attempt.timeRemainingSeconds ?? attempt.test.durationSeconds ?? 1800) / 60));
  return (
    <TestPlayer
      testId={attempt.testId}
      attemptId={attempt.id}
      testTitle={attempt.test.title}
      questions={attempt.questions.map(mapQuestion)}
      durationMinutes={durationMinutes}
    />
  );
}
