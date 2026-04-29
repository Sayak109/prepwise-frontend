"use server";
export async function createQuestionAction(formData: FormData) { const prompt = String(formData.get("prompt") ?? ""); const topicId = String(formData.get("topicId") ?? ""); return { ok: true, message: `Question added to ${topicId}`, prompt }; }
