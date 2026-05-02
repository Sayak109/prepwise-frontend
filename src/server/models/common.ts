// @ts-nocheck
import mongoose, { Schema } from "mongoose";

export const Roles = ["ADMIN", "EDITOR", "STUDENT"] as const;
export const Statuses = ["ACTIVE", "INACTIVE"] as const;
export const AuthMethods = ["EMAIL_PW", "EMAIL_OTP", "PHONE_OTP", "GOOGLE", "APPLE"] as const;
export const Platforms = ["ANDROID", "IOS", "WEB"] as const;
export const QuestionTypes = ["MCQ", "SHORT_ANSWER", "DESCRIPTIVE"] as const;
export const Difficulties = ["EASY", "MEDIUM", "HARD"] as const;
export const AttemptStatuses = ["IN_PROGRESS", "COMPLETED", "ABANDONED"] as const;
export const TestQuestionStatuses = ["NOT_VISITED", "ANSWERED", "FLAGGED"] as const;

export const schemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(_doc: unknown, ret: Record<string, any>) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform(_doc: unknown, ret: Record<string, any>) {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
} as const;

export function stringId() {
  return { type: String, default: () => crypto.randomUUID() };
}

export function model(name: string, schema: Schema, collection: string): any {
  return mongoose.models[name] || mongoose.model(name, schema, collection);
}

export { Schema };
