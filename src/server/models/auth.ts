// @ts-nocheck
import { AuthMethods, model, Platforms, Roles, schemaOptions, Schema, Statuses, stringId } from "./common";

const UserSchema = new Schema(
  {
    _id: stringId(),
    email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    phoneNo: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    firstName: String,
    lastName: String,
    authMethod: { type: String, enum: AuthMethods, default: "EMAIL_PW" },
    providerId: String,
    role: { type: String, enum: Roles, default: "STUDENT", index: true },
    status: { type: String, enum: Statuses, default: "ACTIVE" },
    resetToken: String,
    resetTokenExp: Date,
    lastLoginAt: Date,
  },
  schemaOptions,
);
UserSchema.index({ authMethod: 1 });

const AuthRateLimitSchema = new Schema(
  {
    _id: stringId(),
    identifier: { type: String, required: true },
    ipAddress: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    penaltyLevel: { type: Number, default: 0 },
    blockedUntil: { type: Date, index: true },
    lastAttemptAt: Date,
  },
  schemaOptions,
);
AuthRateLimitSchema.index({ identifier: 1, ipAddress: 1 }, { unique: true });

const UserSessionSchema = new Schema(
  {
    _id: stringId(),
    sessionId: { type: String, unique: true, default: () => crypto.randomUUID() },
    userId: { type: String, required: true, index: true },
    deviceInfo: Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    refreshTokenHash: { type: String, unique: true, required: true },
    refreshTokenEncrypted: String,
    expiresAt: { type: Date, required: true, index: true },
    lastUsedAt: Date,
    revokedAt: { type: Date, index: true },
  },
  schemaOptions,
);
UserSessionSchema.index({ sessionId: 1, userId: 1 });

const InvalidatedTokenSchema = new Schema(
  {
    _id: stringId(),
    userId: { type: String, index: true },
    tokenHash: { type: String, unique: true, required: true },
    reason: String,
    expiresAt: { type: Date, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false, toJSON: schemaOptions.toJSON, toObject: schemaOptions.toObject },
);

const UserFCMTokenSchema = new Schema(
  {
    _id: stringId(),
    userId: { type: String, required: true, index: true },
    token: { type: String, unique: true, required: true },
    deviceId: String,
    platform: { type: String, enum: Platforms, required: true, index: true },
    isActive: { type: Boolean, default: true, index: true },
    lastUsedAt: Date,
  },
  schemaOptions,
);

export const User = model("User", UserSchema, "users");
export const AuthRateLimit = model("AuthRateLimit", AuthRateLimitSchema, "auth_rate_limits");
export const UserSession = model("UserSession", UserSessionSchema, "user_sessions");
export const InvalidatedToken = model("InvalidatedToken", InvalidatedTokenSchema, "invalidated_tokens");
export const UserFCMToken = model("UserFCMToken", UserFCMTokenSchema, "user_fcm_tokens");
