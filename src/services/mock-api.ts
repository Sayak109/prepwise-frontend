import { attempts } from "@/data/attempts";
import { questions } from "@/data/questions";
import { tests } from "@/data/tests";
import { topics } from "@/data/topics";
import { users } from "@/data/users";
const sleep = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
export async function fetchTopics() { await sleep(); return topics; }
export async function fetchTopicById(topicId: string) { await sleep(); return topics.find((t) => t.id === topicId) ?? null; }
export async function fetchQuestionsByTopic(topicId: string) { await sleep(); return questions.filter((q) => q.topicId === topicId); }
export async function fetchTests() { await sleep(); return tests; }
export async function fetchTestById(testId: string) { await sleep(); return tests.find((t) => t.id === testId) ?? null; }
export async function fetchQuestionsByIds(ids: string[]) { await sleep(); return questions.filter((q) => ids.includes(q.id)); }
export async function fetchUsers() { await sleep(); return users; }
export async function fetchAttemptsByUser(userId: string) { await sleep(); return attempts.filter((a) => a.userId === userId); }
