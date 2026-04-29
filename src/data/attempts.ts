import { Attempt } from "@/types";

export const attempts: Attempt[] = [
  { id: "a1", userId: "u-student-1", testId: "test-1", score: 3, total: 4, accuracy: 75, createdAt: "2026-04-15" },
  { id: "a2", userId: "u-student-1", testId: "test-3", score: 4, total: 5, accuracy: 80, createdAt: "2026-04-20" },
  { id: "a3", userId: "u-student-2", testId: "test-2", score: 3, total: 4, accuracy: 75, createdAt: "2026-04-18" },
  { id: "a4", userId: "u-student-3", testId: "test-1", score: 2, total: 4, accuracy: 50, createdAt: "2026-04-22" },
  { id: "a5", userId: "u-student-4", testId: "test-3", score: 3, total: 5, accuracy: 60, createdAt: "2026-04-25" },
];
