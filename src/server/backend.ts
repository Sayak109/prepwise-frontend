import type { NextRequest } from "next/server";
import { apiError } from "@/server/api-response";
import { connectDb } from "@/server/db";
import { handleActivity } from "@/server/api/modules/activity";
import { handleAdmin } from "@/server/api/modules/admin";
import { handleAuth } from "@/server/api/modules/auth";
import { handleDashboard } from "@/server/api/modules/dashboard";
import { handleOtp } from "@/server/api/modules/otp";
import { handlePractice } from "@/server/api/modules/practice";
import { handleStudentTest } from "@/server/api/modules/student-test";

export async function handleApi(req: NextRequest, segments: string[] = []) {
  try {
    await connectDb();
    const url = new URL(req.url);
    const root = segments[0];
    const result =
      root === "auth" ? await handleAuth(req, segments) :
      root === "practice" ? await handlePractice(req, segments, url) :
      root === "test" ? await handleStudentTest(req, segments, url) :
      root === "dashboard" ? await handleDashboard(req, segments, url) :
      root === "admin" && segments[1] === "activity-log" ? await handleActivity(req, segments, url) :
      root === "admin" ? await handleAdmin(req, segments, url) :
      root === "otp" ? await handleOtp(req, segments) :
      undefined;

    if (result) return result;
    return apiError(new Error("Route not found"), "Route not found", 404);
  } catch (error: any) {
    return apiError(error, "Request failed.", error?.status ?? 400);
  }
}

