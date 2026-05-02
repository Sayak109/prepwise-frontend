import bcrypt from "bcryptjs";
import crypto, { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import type { NextRequest } from "next/server";
import { decryptData, encryptData } from "@/server/backend-crypto";
import { McqOption, Question, Test, TestAttempt, TestAttemptQuestionState, TestQuestion, Topic, User, UserSession, Answer } from "@/server/models";

export type UserRole = "ADMIN" | "EDITOR" | "STUDENT";
export type AttemptStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
export type TestQuestionStatus = "NOT_VISITED" | "ANSWERED" | "FLAGGED";

export const JWT_SECRET = process.env.JWT_SECRET || process.env.PRIVATE_ENCRYPTION_KEY || "prepwise-local-secret";

export { bcrypt, crypto, encryptData, decryptData, randomUUID };

export function toPlain<T = any>(value: any): T {
  const raw = typeof value?.toJSON === "function" ? value.toJSON() : value;
  if (Array.isArray(raw)) return raw.map((item) => toPlain(item)) as T;
  if (raw && typeof raw === "object") {
    const output: Record<string, any> = {};
    for (const [key, nested] of Object.entries(raw)) {
      if (key === "__v") continue;
      output[key === "_id" ? "id" : key] = toPlain(nested);
    }
    return output as T;
  }
  return raw as T;
}

export function num(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function paginate(url: URL, fallbackLimit = 10, max = 100) {
  const page = Math.max(num(url.searchParams.get("page"), 1), 1);
  const limit = Math.min(Math.max(num(url.searchParams.get("limit"), fallbackLimit), 1), max);
  return { page, limit, skip: (page - 1) * limit };
}

export function regex(value: string) {
  return new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
}

export function withName(user: any) {
  if (!user) return null;
  const plain = toPlain(user);
  return {
    ...plain,
    name: [plain.firstName, plain.lastName].filter(Boolean).join(" ") || null,
  };
}

export function publicUser(user: any) {
  const plain = withName(user);
  if (!plain) return null;
  delete plain.passwordHash;
  delete plain.providerId;
  delete plain.resetToken;
  delete plain.resetTokenExp;
  return plain;
}

export function bodyPayload(body: any) {
  if (body?.data && typeof body.data === "string") {
    const decrypted = decryptData(body.data);
    if (!decrypted) {
      throw new Error(
        "Invalid encrypted payload. Set PRIVATE_ENCRYPTION_KEY (or NEXT_PRIVATE_ENCRYPTION_KEY) in .env.local to the same value for both the Next server and Server Actions.",
      );
    }
    return decrypted;
  }
  return body ?? {};
}

export async function readBody(req: NextRequest) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export async function currentUser(req: NextRequest) {
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw Object.assign(new Error("Unauthorized"), { status: 401 });
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  const user = await User.findById(decoded.sub);
  if (!user || user.status === "INACTIVE") throw Object.assign(new Error("Unauthorized"), { status: 401 });
  return { ...toPlain(user), sid: decoded.sid };
}

export function requireRole(user: any, roles: UserRole[]) {
  if (!roles.includes(user.role)) throw Object.assign(new Error("Forbidden"), { status: 403 });
}

export function signAccessToken(user: any, sessionId: string) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, sid: sessionId, status: user.status },
    JWT_SECRET,
    { expiresIn: (process.env.JWT_EXPIRATION || process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"] },
  );
}

export function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createSession(user: any, req: NextRequest) {
  const refreshPlain = randomUUID() + randomUUID();
  const session = await UserSession.create({
    sessionId: randomUUID(),
    userId: user.id,
    ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0],
    userAgent: req.headers.get("user-agent") ?? undefined,
    deviceInfo: { userAgent: req.headers.get("user-agent") },
    refreshTokenHash: hash(refreshPlain),
    refreshTokenEncrypted: encryptData(refreshPlain),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  return { session: toPlain(session), refreshPlain };
}

export async function authResponse(user: any, req: NextRequest) {
  const { session, refreshPlain } = await createSession(user, req);
  return {
    accessToken: signAccessToken(toPlain(user), session.sessionId),
    refreshToken: encryptData(refreshPlain),
  };
}

export async function getTopic(id: string) {
  const topic = await Topic.findById(id);
  if (!topic) throw new Error("Topic not found.");
  return topic;
}

export async function topicDto(topic: any, includeQuestions = false) {
  const plain = toPlain(topic);
  const [parent, children, questionCount, questions] = await Promise.all([
    plain.parentId ? Topic.findById(plain.parentId).select("title slug").then(toPlain) : null,
    Topic.find({ parentId: plain.id }).sort({ title: 1 }).select("title slug isPremium").then(toPlain),
    Question.countDocuments({ topicId: plain.id }),
    includeQuestions ? findQuestions({ topicId: plain.id }, 1, 1000, true).then((r) => r.questions) : undefined,
  ]);
  return { ...plain, parent, children, _count: { children: children.length, questions: questionCount }, ...(includeQuestions ? { questions } : {}) };
}

export async function buildUniqueSlug(value: string, ignoreId?: string) {
  const base = slugify(value.trim(), { lower: true, strict: true });
  if (!base) throw new Error("Topic slug is invalid.");
  let slug = base;
  let counter = 1;
  while (await Topic.findOne({ slug, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) }).select("_id")) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export async function questionDto(question: any, publicOnly = false) {
  const plain = toPlain(question);
  const [topic, options, correctOption, createdBy, updatedBy] = await Promise.all([
    Topic.findById(plain.topicId).select("title slug").then(toPlain),
    McqOption.find({ questionId: plain.id }).sort({ displayOrder: 1 }).then(toPlain),
    plain.correctOptionId ? McqOption.findById(plain.correctOptionId).select("optionText displayOrder").then(toPlain) : null,
    publicOnly || !plain.createdById ? null : User.findById(plain.createdById).select("email firstName lastName").then(toPlain),
    publicOnly || !plain.updatedById ? null : User.findById(plain.updatedById).select("email firstName lastName").then(toPlain),
  ]);
  return { ...plain, topic, options, correctOption, ...(publicOnly ? {} : { createdBy, updatedBy }) };
}

export async function findQuestions(where: Record<string, any>, page: number, limit: number, publicOnly = false) {
  const [questions, total] = await Promise.all([
    Question.find(where).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Question.countDocuments(where),
  ]);
  return {
    questions: await Promise.all(questions.map((q: any) => questionDto(q, publicOnly))),
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function testDto(test: any, detail = false) {
  const plain = toPlain(test);
  const [topic, testQuestions, attempts] = await Promise.all([
    plain.topicId ? Topic.findById(plain.topicId).select("title slug").then(toPlain) : null,
    TestQuestion.find({ testId: plain.id }).sort({ displayOrder: 1 }).then(toPlain),
    TestAttempt.countDocuments({ testId: plain.id }),
  ]);
  const questions = await Promise.all(
    testQuestions.map(async (tq: any) => ({
      ...tq,
      question: await questionDto(await Question.findById(tq.questionId), detail),
    })),
  );
  return { ...plain, topic, questions, _count: { questions: testQuestions.length, attempts } };
}

export async function findTests(url: URL) {
  const { page, limit, skip } = paginate(url);
  const where: Record<string, any> = {};
  if (url.searchParams.get("topicId")) where.topicId = url.searchParams.get("topicId");
  if (url.searchParams.get("difficulty")) where.difficulty = url.searchParams.get("difficulty");
  if (url.searchParams.get("isPremium") !== null) where.isPremium = url.searchParams.get("isPremium") === "true";
  if (url.searchParams.get("search")) where.title = regex(url.searchParams.get("search")!);
  const [tests, total] = await Promise.all([Test.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit), Test.countDocuments(where)]);
  return { tests: await Promise.all(tests.map((test: any) => testDto(test))), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export function questionWhere(url: URL, topicId?: string) {
  const where: Record<string, any> = {};
  if (topicId) where.topicId = topicId;
  if (url.searchParams.get("topicId")) where.topicId = url.searchParams.get("topicId");
  if (url.searchParams.get("type")) where.type = url.searchParams.get("type");
  if (url.searchParams.get("difficulty")) where.difficulty = url.searchParams.get("difficulty");
  if (url.searchParams.get("isPremium") !== null) where.isPremium = url.searchParams.get("isPremium") === "true";
  if (url.searchParams.get("search")) where.questionText = regex(url.searchParams.get("search")!);
  return where;
}

export async function replaceOptions(questionId: string, options: any[]) {
  if (options.length < 2) throw new Error("MCQ questions require at least two options.");
  if (options.filter((o) => o.isCorrect).length !== 1) throw new Error("MCQ questions require exactly one correct option.");
  await McqOption.deleteMany({ questionId });
  let correctOptionId: string | undefined;
  for (const [index, option] of options.entries()) {
    const created = await McqOption.create({
      questionId,
      optionText: option.optionText,
      displayOrder: option.displayOrder ?? index,
    });
    if (option.isCorrect) correctOptionId = toPlain(created).id;
  }
  await Question.findByIdAndUpdate(questionId, { correctOptionId });
}

export async function replaceTestQuestions(testId: string, questions: any[]) {
  const ids = questions.map((item) => item.questionId);
  if (new Set(ids).size !== ids.length) throw new Error("Duplicate questions are not allowed.");
  const existing = await Question.countDocuments({ _id: { $in: ids } });
  if (existing !== ids.length) throw new Error("One or more questions were not found.");
  await TestQuestion.deleteMany({ testId });
  await TestQuestion.insertMany(
    questions.map((item, index) => ({
      testId,
      questionId: item.questionId,
      displayOrder: item.displayOrder ?? index,
      points: item.points ?? 1,
    })),
  );
}

export async function getAttempt(attemptId: string, userId: string) {
  const attempt = toPlain(await TestAttempt.findOne({ _id: attemptId, userId }));
  if (!attempt) throw new Error("Test attempt not found.");
  const test = await testDto(await Test.findById(attempt.testId), true);
  if (attempt.status === "IN_PROGRESS" && test.isTimed && remainingSeconds(attempt, test) <= 0) {
    await completeAttempt(attempt.id);
    attempt.status = "COMPLETED";
    attempt.completedAt = new Date();
  }
  const [answers, states] = await Promise.all([
    Answer.find({ attemptId }).then(toPlain),
    TestAttemptQuestionState.find({ attemptId }).then(toPlain),
  ]);
  const answerByQuestion = new Map(answers.map((answer: any) => [answer.questionId, answer]));
  const stateByQuestion = new Map(states.map((state: any) => [state.questionId, state]));
  return {
    id: attempt.id,
    testId: attempt.testId,
    score: attempt.score,
    status: attempt.status,
    startedAt: attempt.startedAt,
    completedAt: attempt.completedAt,
    timeRemainingSeconds: test.isTimed ? remainingSeconds(attempt, test) : null,
    test: { id: test.id, title: test.title, topicId: test.topicId, difficulty: test.difficulty, isTimed: test.isTimed, durationSeconds: test.durationSeconds, isPremium: test.isPremium, topic: test.topic },
    summary: {
      totalQuestions: test.questions.length,
      answered: answers.length,
      flagged: states.filter((s: any) => s.status === "FLAGGED").length,
      notVisited: states.filter((s: any) => s.status === "NOT_VISITED").length,
    },
    questions: test.questions.map((tq: any) => {
      const answer: any = answerByQuestion.get(tq.questionId);
      const state: any = stateByQuestion.get(tq.questionId);
      return {
        ...tq.question,
        testQuestionId: tq.id,
        displayOrder: tq.displayOrder,
        points: tq.points,
        state: state?.status ?? "NOT_VISITED",
        selectedOptionId: answer?.selectedOptionId ?? null,
        answerText: answer?.answerText ?? null,
      };
    }),
  };
}

export function remainingSeconds(attempt: any, test: any) {
  if (!test.isTimed || !test.durationSeconds) return 0;
  const elapsed = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
  return Math.max(test.durationSeconds - elapsed, 0);
}

export async function evaluateAnswer(testQuestion: any, body: any) {
  const question = await questionDto(await Question.findById(testQuestion.questionId), true);
  const points = Number(testQuestion.points ?? 1);
  if (question.type === "MCQ") {
    if (!body.selectedOptionId) throw new Error("Selected option is required for MCQ questions.");
    if (!question.options.some((o: any) => o.id === body.selectedOptionId)) throw new Error("Selected option does not belong to this question.");
    const isCorrect = body.selectedOptionId === question.correctOptionId;
    return { selectedOptionId: body.selectedOptionId, answerText: null, isCorrect, score: isCorrect ? points : 0 };
  }
  if (!body.answerText?.trim()) throw new Error("Answer text is required for this question.");
  if (question.type === "SHORT_ANSWER") {
    const expected = question.correctAnswer?.trim() ?? "";
    const actual = body.answerText.trim();
    let isCorrect: boolean | null = null;
    if (expected) {
      const tolerance = question.numericTolerance;
      if (tolerance !== null && tolerance !== undefined && !Number.isNaN(Number(expected)) && !Number.isNaN(Number(actual))) {
        isCorrect = Math.abs(Number(expected) - Number(actual)) <= Number(tolerance);
      } else {
        isCorrect = question.caseInsensitiveMatch === false ? expected === actual : expected.toLowerCase() === actual.toLowerCase();
      }
    }
    return { selectedOptionId: null, answerText: actual, isCorrect, score: isCorrect ? points : 0 };
  }
  return { selectedOptionId: null, answerText: body.answerText.trim(), isCorrect: null, score: 0 };
}

export async function refreshAttemptScore(attemptId: string) {
  const answers = await Answer.find({ attemptId }).select("score").then(toPlain);
  const score = answers.reduce((sum: number, answer: any) => sum + Number(answer.score ?? 0), 0);
  await TestAttempt.findByIdAndUpdate(attemptId, { score });
}

export async function completeAttempt(attemptId: string) {
  await refreshAttemptScore(attemptId);
  await TestAttempt.findByIdAndUpdate(attemptId, { status: "COMPLETED", completedAt: new Date() });
}

