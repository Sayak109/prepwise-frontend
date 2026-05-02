import type { NextRequest } from "next/server";
import { apiResponse } from "@/server/api-response";
import { AdminSettings, EditorTopicPermission, Question, Test, Topic, User } from "@/server/models";
import {
  bcrypt,
  buildUniqueSlug,
  currentUser,
  findQuestions,
  findTests,
  getTopic,
  paginate,
  publicUser,
  questionDto,
  questionWhere,
  regex,
  replaceOptions,
  replaceTestQuestions,
  requireRole,
  readBody,
  testDto,
  toPlain,
  topicDto,
} from "@/server/api/shared";
import { handlePractice } from "./practice";

export async function handleAdmin(req: NextRequest, path: string[], url: URL) {
  const me = await currentUser(req);
  requireRole(me, ["ADMIN"]);
  const section = path[1];
  const id = path[2];
  const body = await readBody(req);

  if (section === "topic") {
    if (req.method === "POST") return apiResponse(await topicDto(await Topic.create({ title: body.title.trim(), slug: await buildUniqueSlug(body.slug ?? body.title), description: body.description, parentId: body.parentId, isPremium: body.isPremium ?? false })), "Topic created successfully.", 201);
    if (req.method === "GET" && !id) return handlePractice(req, ["practice", "topics"], url);
    if (req.method === "GET") return apiResponse(await topicDto(await getTopic(id)), "Topic fetched successfully.");
    if (req.method === "PATCH") return apiResponse(await topicDto(await Topic.findByIdAndUpdate(id, { ...body, slug: body.slug ? await buildUniqueSlug(body.slug, id) : undefined }, { new: true })), "Topic updated successfully.");
    if (req.method === "DELETE") return apiResponse(toPlain(await Topic.findByIdAndDelete(id)), "Topic deleted successfully.");
  }

  if (section === "question") {
    if (req.method === "POST") {
      await getTopic(body.topicId);
      const question = await Question.create({ ...body, createdById: me.id, isPremium: body.isPremium ?? false });
      if (body.type === "MCQ") await replaceOptions(question.id, body.options ?? []);
      return apiResponse(await questionDto(question), "Question created successfully.", 201);
    }
    if (req.method === "GET" && !id) {
      const { page, limit } = paginate(url);
      return apiResponse(await findQuestions(questionWhere(url), page, limit), "Questions fetched successfully.");
    }
    if (req.method === "GET") return apiResponse(await questionDto(await Question.findById(id)), "Question fetched successfully.");
    if (req.method === "PATCH") {
      const question = await Question.findByIdAndUpdate(id, { ...body, updatedById: me.id }, { new: true });
      if (body.options) await replaceOptions(id, body.options);
      return apiResponse(await questionDto(question), "Question updated successfully.");
    }
    if (req.method === "DELETE") return apiResponse(toPlain(await Question.findByIdAndDelete(id)), "Question deleted successfully.");
  }

  if (section === "test") {
    if (req.method === "POST") {
      const test = await Test.create({ ...body, title: body.title.trim(), createdById: me.id, durationSeconds: body.isTimed ? body.durationSeconds : undefined });
      if (body.questions?.length) await replaceTestQuestions(test.id, body.questions);
      return apiResponse(await testDto(test, true), "Test created successfully.", 201);
    }
    if (req.method === "GET" && !id) return apiResponse(await findTests(url), "Tests fetched successfully.");
    if (req.method === "GET") return apiResponse(await testDto(await Test.findById(id), true), "Test fetched successfully.");
    if (req.method === "PATCH" && path[3] === "questions") {
      await replaceTestQuestions(id, body.questions ?? []);
      return apiResponse(await testDto(await Test.findById(id), true), "Test questions updated successfully.");
    }
    if (req.method === "PATCH") return apiResponse(await testDto(await Test.findByIdAndUpdate(id, body, { new: true }), true), "Test updated successfully.");
    if (req.method === "DELETE") return apiResponse(toPlain(await Test.findByIdAndDelete(id)), "Test deleted successfully.");
  }

  if (section === "user") {
    if (req.method === "GET" && id && path[3] === "permissions") {
      const permissions = await EditorTopicPermission.find({ editorId: id }).sort({ createdAt: -1 }).then(toPlain);
      return apiResponse(permissions, "Editor permissions fetched successfully.");
    }
    if (req.method === "PUT" && id && path[3] === "permissions") {
      await EditorTopicPermission.deleteMany({ editorId: id });
      await EditorTopicPermission.insertMany((body.permissions ?? []).map((p: any) => ({ ...p, editorId: id, assignedById: me.id })));
      return apiResponse(await EditorTopicPermission.find({ editorId: id }).then(toPlain), "Editor permissions updated successfully.");
    }
    if (req.method === "GET") {
      const { page, limit, skip } = paginate(url);
      const where: Record<string, any> = {};
      if (url.searchParams.get("role")) where.role = url.searchParams.get("role");
      if (url.searchParams.get("status")) where.status = url.searchParams.get("status");
      if (url.searchParams.get("search")) where.$or = ["email", "firstName", "lastName", "phoneNo"].map((key) => ({ [key]: regex(url.searchParams.get("search")!) }));
      const [users, total] = await Promise.all([User.find(where).sort({ createdAt: -1 }).skip(skip).limit(limit), User.countDocuments(where)]);
      return apiResponse({ users: users.map((u: (typeof users)[number]) => publicUser(u)), meta: { page, limit, total, totalPages: Math.ceil(total / limit) } }, "Users fetched successfully.");
    }
    if (req.method === "POST") {
      const editor = await User.create({ ...body, email: body.email?.trim().toLowerCase(), passwordHash: await bcrypt.hash(String(body.password), 10), role: "EDITOR", status: body.status ?? "ACTIVE", authMethod: "EMAIL_PW" });
      return apiResponse(publicUser(editor), "Editor created successfully.", 201);
    }
    if (req.method === "PATCH") {
      const update = { ...body, email: body.email?.trim().toLowerCase(), passwordHash: body.password ? await bcrypt.hash(String(body.password), 10) : undefined };
      return apiResponse(publicUser(await User.findByIdAndUpdate(id, update, { new: true })), "Editor updated successfully.");
    }
  }

  if (section === "settings") {
    if (req.method === "POST") return apiResponse(toPlain(await AdminSettings.create(body)), "Settings created successfully.", 201);
    if (req.method === "GET" && !id) return apiResponse(toPlain(await AdminSettings.find().sort({ createdAt: -1 })), "Settings fetched successfully.");
    if (req.method === "GET") return apiResponse(toPlain(await AdminSettings.findById(id)), "Settings fetched successfully.");
    if (req.method === "PATCH") return apiResponse(toPlain(await AdminSettings.findByIdAndUpdate(id, body, { new: true })), "Settings updated successfully.");
    if (req.method === "DELETE") return apiResponse(toPlain(await AdminSettings.findByIdAndDelete(id)), "Settings deleted successfully.");
  }
}

