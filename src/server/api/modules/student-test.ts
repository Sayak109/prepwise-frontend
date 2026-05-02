import type { NextRequest } from "next/server";
import { apiResponse } from "@/server/api-response";
import { Answer, McqOption, Question, Test, TestAttempt, TestAttemptQuestionState, TestQuestion } from "@/server/models";
import {
  completeAttempt,
  currentUser,
  evaluateAnswer,
  evaluateSubmissionItem,
  findTests,
  getAttempt,
  readBody,
  refreshAttemptScore,
  testDto,
  toPlain,
} from "@/server/api/shared";

export async function handleStudentTest(req: NextRequest, path: string[], url: URL) {
  const user = path[1] === undefined || req.method === "GET" ? null : await currentUser(req);
  if (req.method === "GET" && !path[1]) return apiResponse(await findTests(url), "Tests fetched successfully.");
  if (req.method === "GET" && path[1] && path[1] !== "attempts") return apiResponse(await testDto(await Test.findById(path[1]), true), "Test fetched successfully.");
  if (req.method === "POST" && path[2] === "start") {
    const me = await currentUser(req);
    const testQuestions = await TestQuestion.find({ testId: path[1] }).sort({ displayOrder: 1 }).then(toPlain);
    if (!testQuestions.length) throw new Error("This test does not have any questions.");
    const attempt = await TestAttempt.create({ testId: path[1], userId: me.id, status: "IN_PROGRESS" });
    await TestAttemptQuestionState.insertMany(testQuestions.map((q: any) => ({ attemptId: attempt.id, questionId: q.questionId, userId: me.id, status: "NOT_VISITED" })));
    return apiResponse(await getAttempt(attempt.id, me.id), "Test attempt started successfully.", 201);
  }
  if (path[1] === "attempts") {
    const me = user ?? (await currentUser(req));
    const attemptId = path[2];
    if (req.method === "GET" && attemptId && !path[3]) return apiResponse(await getAttempt(attemptId, me.id), "Test attempt fetched successfully.");
    if (req.method === "PATCH" && path[3] === "questions") {
      const questionId = path[4];
      if (path[5] === "visit") {
        await TestAttemptQuestionState.findOneAndUpdate({ attemptId, questionId }, { visitedAt: new Date() }, { upsert: true, setDefaultsOnInsert: true });
      }
      if (path[5] === "flag") {
        const body = await readBody(req);
        const answer = await Answer.findOne({ attemptId, questionId });
        await TestAttemptQuestionState.findOneAndUpdate({ attemptId, questionId }, { status: body.flagged ? "FLAGGED" : answer ? "ANSWERED" : "NOT_VISITED", flaggedAt: body.flagged ? new Date() : null, visitedAt: new Date(), userId: me.id }, { upsert: true, setDefaultsOnInsert: true });
      }
      if (path[5] === "answer") {
        const body = await readBody(req);
        const attempt = await TestAttempt.findOne({ _id: attemptId, userId: me.id });
        if (!attempt || attempt.status !== "IN_PROGRESS") throw new Error("This test attempt is already completed.");
        const testQuestion = toPlain(await TestQuestion.findOne({ testId: attempt.testId, questionId }));
        const evaluation = await evaluateAnswer(testQuestion, body);
        await Answer.findOneAndUpdate({ attemptId, questionId }, { ...evaluation, userId: me.id, submittedAt: new Date() }, { upsert: true, setDefaultsOnInsert: true });
        const state = await TestAttemptQuestionState.findOne({ attemptId, questionId });
        await TestAttemptQuestionState.findOneAndUpdate({ attemptId, questionId }, { status: state?.status === "FLAGGED" ? "FLAGGED" : "ANSWERED", visitedAt: new Date(), answeredAt: new Date(), userId: me.id }, { upsert: true, setDefaultsOnInsert: true });
        await refreshAttemptScore(attemptId);
      }
      return apiResponse(await getAttempt(attemptId, me.id), "Test attempt updated successfully.");
    }
    if (req.method === "POST" && path[3] === "complete") {
      const body = await readBody(req);
      const attempt = await TestAttempt.findOne({ _id: attemptId, userId: me.id });
      if (!attempt) throw new Error("Test attempt not found.");
      const answersPayload = body.answers ?? [];
      if (answersPayload.length) {
        const testQuestionRows = await TestQuestion.find({ testId: attempt.testId }).lean();
        const tqByQuestionId = new Map<string, any>(
          testQuestionRows.map((tq: any) => [String(tq.questionId), toPlain(tq)]),
        );
        const questionIds = [...new Set(answersPayload.map((a: any) => String(a.questionId)).filter(Boolean))];
        const questionDocs = await Question.find({ _id: { $in: questionIds } }).lean();
        const qById = new Map<string, any>(questionDocs.map((q: any) => [String(q._id), toPlain(q)]));
        const mcqQuestionIds = questionDocs.filter((q: any) => q.type === "MCQ").map((q: any) => String(q._id));
        const mcqOptionDocs =
          mcqQuestionIds.length > 0
            ? await McqOption.find({ questionId: { $in: mcqQuestionIds } }).sort({ displayOrder: 1 }).lean()
            : [];
        const optionsByQ = new Map<string, any[]>();
        for (const opt of mcqOptionDocs) {
          const qid = String(opt.questionId);
          if (!optionsByQ.has(qid)) optionsByQ.set(qid, []);
          optionsByQ.get(qid)!.push(toPlain(opt));
        }
        const writeTasks = answersPayload.map((item: any) => {
          const qid = String(item.questionId);
          const testQuestion = tqByQuestionId.get(qid);
          if (!testQuestion) return null;
          const q = qById.get(qid);
          if (!q) return null;
          const opts = q.type === "MCQ" ? optionsByQ.get(qid) ?? [] : [];
          const evaluation = evaluateSubmissionItem(q, opts, testQuestion, item);
          return Answer.findOneAndUpdate(
            { attemptId, questionId: item.questionId },
            { ...evaluation, userId: me.id, submittedAt: new Date() },
            { upsert: true, setDefaultsOnInsert: true },
          );
        });
        await Promise.all(writeTasks.filter(Boolean) as Promise<unknown>[]);
      }
      await completeAttempt(attemptId);
      return apiResponse(await getAttempt(attemptId, me.id), "Test attempt completed successfully.");
    }
  }
}

