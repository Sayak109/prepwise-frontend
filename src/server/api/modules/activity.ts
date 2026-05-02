import type { NextRequest } from "next/server";
import { apiResponse } from "@/server/api-response";
import { AdminActivityLog } from "@/server/models";
import { currentUser, paginate, readBody, toPlain } from "@/server/api/shared";

export async function handleActivity(req: NextRequest, _path: string[], url: URL) {
  await currentUser(req);
  if (req.method === "POST") return apiResponse(toPlain(await AdminActivityLog.create(await readBody(req))), "Activity log created successfully.", 201);
  if (req.method === "GET") {
    const { page, limit, skip } = paginate(url);
    const [items, total] = await Promise.all([AdminActivityLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit), AdminActivityLog.countDocuments()]);
    return apiResponse({ items: toPlain(items), total, page, limit }, "Activity logs fetched successfully.");
  }
}

