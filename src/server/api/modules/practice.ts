import type { NextRequest } from "next/server";
import { apiResponse } from "@/server/api-response";
import { Topic } from "@/server/models";
import { findQuestions, getTopic, paginate, questionWhere, regex, topicDto } from "@/server/api/shared";

export async function handlePractice(req: NextRequest, path: string[], url: URL) {
  if (req.method === "GET" && path[1] === "topics" && !path[2]) {
    const { page, limit, skip } = paginate(url, 20);
    const where: Record<string, any> = {};
    if (url.searchParams.get("parentId")) where.parentId = url.searchParams.get("parentId");
    if (url.searchParams.get("isPremium") !== null) where.isPremium = url.searchParams.get("isPremium") === "true";
    if (url.searchParams.get("search")) where.$or = ["title", "slug", "description"].map((key) => ({ [key]: regex(url.searchParams.get("search")!) }));
    const [topics, total] = await Promise.all([Topic.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit), Topic.countDocuments(where)]);
    const includeQuestions = url.searchParams.get("includeQuestions") !== "false";
    return apiResponse({ topics: await Promise.all(topics.map((t: any) => topicDto(t, includeQuestions))), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }, "Practice topics fetched successfully.");
  }
  if (req.method === "GET" && path[1] === "topics" && path[2]) {
    const topic = await topicDto(await getTopic(path[2]), false);
    const { page, limit } = paginate(url, 20);
    const questions = await findQuestions(questionWhere(url, path[2]), page, limit, true);
    return apiResponse(path[3] === "start" ? { topic, ...questions } : questions, path[3] === "start" ? "Topic practice started successfully." : "Practice questions fetched successfully.");
  }
}

