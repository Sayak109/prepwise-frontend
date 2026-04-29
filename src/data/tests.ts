import { Test } from "@/types";

export const tests: Test[] = [
  { id: "test-1", title: "Starter Math + Geometry", topicIds: ["t-math", "t-geo"], questionIds: ["q1", "q2", "q3", "q7"], durationMinutes: 20, premium: false },
  { id: "test-2", title: "Science Drill", topicIds: ["t-phy", "t-chem"], questionIds: ["q4", "q5", "q8", "q10"], durationMinutes: 25, premium: true },
  { id: "test-3", title: "Mixed Full Practice", topicIds: ["t-math", "t-geo", "t-phy", "t-eng"], questionIds: ["q1", "q3", "q4", "q6", "q9"], durationMinutes: 30, premium: false },
];
