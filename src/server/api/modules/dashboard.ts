import type { NextRequest } from "next/server";
import { apiResponse } from "@/server/api-response";
import { Test, TestAttempt } from "@/server/models";
import { currentUser, paginate, testDto, toPlain } from "@/server/api/shared";

export async function handleDashboard(req: NextRequest, path: string[], url: URL) {
  const me = await currentUser(req);
  const attempts = await TestAttempt.find({ userId: me.id, status: "COMPLETED" }).sort({ completedAt: -1, startedAt: -1 }).then(toPlain);
  const latestByTest = new Map<string, any>();
  for (const attempt of attempts) if (!latestByTest.has(attempt.testId)) latestByTest.set(attempt.testId, attempt);
  const unique = [...latestByTest.values()];
  const rows = await Promise.all(unique.map(async (attempt) => {
    const test = await testDto(await Test.findById(attempt.testId), true);
    const totalScore = test.questions.reduce((sum: number, q: any) => sum + Number(q.points ?? 0), 0);
    const scorePercent = totalScore > 0 ? Math.round((Number(attempt.score) / totalScore) * 100) : 0;
    return { id: attempt.id, testId: attempt.testId, title: test.title, attemptedAt: attempt.completedAt ?? attempt.startedAt, attemptedDate: new Date(attempt.completedAt ?? attempt.startedAt).toISOString().slice(0, 10), scorePercent, earnedScore: attempt.score, totalScore, result: scorePercent >= 60 ? "PASSED" : "FAILED" };
  }));
  if (path[1] === "recent-attempts") {
    const { page, limit, skip } = paginate(url, 5, 50);
    return apiResponse({ attempts: rows.slice(skip, skip + limit), meta: { page, limit, total: rows.length, totalPages: Math.ceil(rows.length / limit) } }, "Recent attempts fetched successfully.");
  }
  const totalTests = await Test.countDocuments();
  const possible = rows.reduce((sum, r) => sum + Number(r.totalScore), 0);
  const earned = rows.reduce((sum, r) => sum + Number(r.earnedScore), 0);
  return apiResponse({ stats: { overallScore: possible ? Math.round((earned / possible) * 100) : 0, testsCompleted: rows.length, totalTests, testsCompletedPercent: totalTests ? Math.round((rows.length / totalTests) * 100) : 0, studyStreak: { currentDays: rows.length ? 1 : 0, highestDays: rows.length ? 1 : 0 } }, recentAttempts: rows.slice(0, 5) }, "Dashboard fetched successfully.");
}

