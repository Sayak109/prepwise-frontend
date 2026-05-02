import type { NextRequest } from "next/server";
import { apiResponse } from "@/server/api-response";
import { OTP } from "@/server/models";
import { readBody, toPlain } from "@/server/api/shared";

export async function handleOtp(req: NextRequest, path: string[]) {
  const body = await readBody(req);
  if (req.method === "POST" && path[1] === "send") {
    const otp = process.env.OTP_SMS_SEND === "true" ? Math.floor(100000 + Math.random() * 900000) : 111111;
    const record = await OTP.create({ credential: body.credential, OTP: otp, expire_at: new Date(Date.now() + 5 * 60 * 1000) });
    return apiResponse(toPlain(record), "OTP sent successfully.");
  }
  if (req.method === "POST" && path[1] === "verify") {
    const record = await OTP.findOne({ credential: body.credential, OTP: Number(body.otp), expire_at: { $gt: new Date() } });
    if (!record) throw new Error("Invalid or expired OTP.");
    return apiResponse(toPlain(record), "OTP verified successfully.");
  }
  if (req.method === "GET" && path[1]) return apiResponse(toPlain(await OTP.findById(path[1])), "OTP fetched successfully.");
  if (req.method === "DELETE" && path[1]) return apiResponse(toPlain(await OTP.findByIdAndDelete(path[1])), "OTP deleted successfully.");
}

