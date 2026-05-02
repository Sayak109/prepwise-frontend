// @ts-nocheck
import { Difficulties, model, QuestionTypes, schemaOptions, Schema, stringId } from "./common";

const TopicSchema = new Schema(
  {
    _id: stringId(),
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    parentId: { type: String, index: true },
    isPremium: { type: Boolean, default: false, index: true },
  },
  schemaOptions,
);

const QuestionSchema = new Schema(
  {
    _id: stringId(),
    topicId: { type: String, required: true, index: true },
    createdById: String,
    updatedById: String,
    type: { type: String, enum: QuestionTypes, required: true, index: true },
    questionText: { type: String, required: true },
    difficulty: { type: String, enum: Difficulties, required: true, index: true },
    explanation: String,
    correctOptionId: { type: String, unique: true, sparse: true },
    correctAnswer: String,
    caseInsensitiveMatch: Boolean,
    numericTolerance: Number,
    sampleAnswer: String,
    isPremium: { type: Boolean, default: false, index: true },
  },
  schemaOptions,
);

const McqOptionSchema = new Schema(
  {
    _id: stringId(),
    questionId: { type: String, required: true, index: true },
    optionText: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
  },
  schemaOptions,
);
McqOptionSchema.index({ questionId: 1, displayOrder: 1 }, { unique: true });

const UserProgressSchema = new Schema(
  {
    _id: stringId(),
    userId: { type: String, required: true },
    topicId: { type: String, required: true, index: true },
    questionsAttempted: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    masteryScore: { type: Number, default: 0 },
    lastAttemptAt: Date,
  },
  schemaOptions,
);
UserProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

const BookmarkSchema = new Schema(
  {
    _id: stringId(),
    userId: { type: String, required: true },
    questionId: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, toJSON: schemaOptions.toJSON, toObject: schemaOptions.toObject },
);
BookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export const Topic = model("Topic", TopicSchema, "topics");
export const Question = model("Question", QuestionSchema, "questions");
export const McqOption = model("McqOption", McqOptionSchema, "mcq_options");
export const UserProgress = model("UserProgress", UserProgressSchema, "user_progress");
export const Bookmark = model("Bookmark", BookmarkSchema, "bookmarks");
