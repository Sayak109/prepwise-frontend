// @ts-nocheck
import { AttemptStatuses, Difficulties, model, schemaOptions, Schema, stringId, TestQuestionStatuses } from "./common";

const TestSchema = new Schema(
  {
    _id: stringId(),
    title: { type: String, required: true },
    topicId: { type: String, index: true },
    difficulty: { type: String, enum: Difficulties, index: true },
    isTimed: { type: Boolean, default: false },
    durationSeconds: Number,
    isPremium: { type: Boolean, default: false, index: true },
    createdById: String,
  },
  schemaOptions,
);

const TestQuestionSchema = new Schema(
  {
    _id: stringId(),
    testId: { type: String, required: true },
    questionId: { type: String, required: true, index: true },
    displayOrder: { type: Number, default: 0 },
    points: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, toJSON: schemaOptions.toJSON, toObject: schemaOptions.toObject },
);
TestQuestionSchema.index({ testId: 1, questionId: 1 }, { unique: true });
TestQuestionSchema.index({ testId: 1, displayOrder: 1 }, { unique: true });

const TestAttemptSchema = new Schema(
  {
    _id: stringId(),
    userId: { type: String, required: true, index: true },
    testId: { type: String, required: true, index: true },
    score: { type: Number, default: 0 },
    status: { type: String, enum: AttemptStatuses, default: "IN_PROGRESS", index: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  schemaOptions,
);

const TestAttemptQuestionStateSchema = new Schema(
  {
    _id: stringId(),
    attemptId: { type: String, required: true },
    questionId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    status: { type: String, enum: TestQuestionStatuses, default: "NOT_VISITED", index: true },
    visitedAt: Date,
    flaggedAt: Date,
    answeredAt: Date,
  },
  schemaOptions,
);
TestAttemptQuestionStateSchema.index({ attemptId: 1, questionId: 1 }, { unique: true });

const AnswerSchema = new Schema(
  {
    _id: stringId(),
    attemptId: { type: String, required: true },
    questionId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    selectedOptionId: String,
    answerText: String,
    isCorrect: Boolean,
    score: { type: Number, default: 0 },
    feedback: String,
    submittedAt: { type: Date, default: Date.now },
  },
  { versionKey: false, toJSON: schemaOptions.toJSON, toObject: schemaOptions.toObject },
);
AnswerSchema.index({ attemptId: 1, questionId: 1 }, { unique: true });

export const Test = model("Test", TestSchema, "tests");
export const TestQuestion = model("TestQuestion", TestQuestionSchema, "test_questions");
export const TestAttempt = model("TestAttempt", TestAttemptSchema, "test_attempts");
export const TestAttemptQuestionState = model("TestAttemptQuestionState", TestAttemptQuestionStateSchema, "test_attempt_question_states");
export const Answer = model("Answer", AnswerSchema, "answers");
