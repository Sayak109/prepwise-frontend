// @ts-nocheck
import { model, schemaOptions, Schema, stringId } from "./common";

const OTPSchema = new Schema(
  {
    _id: stringId(),
    credential: { type: String, index: true },
    OTP: { type: Number, required: true, index: true },
    limit: { type: Number, default: 0 },
    restrictedTime: Date,
    expire_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false, toJSON: schemaOptions.toJSON, toObject: schemaOptions.toObject },
);

export const OTP = model("OTP", OTPSchema, "otp");
