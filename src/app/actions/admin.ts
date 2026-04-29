"use server";
export async function createTopicAction(formData: FormData) { const title = String(formData.get("title") ?? ""); return { ok: true, message: `Topic '${title}' created` }; }
export async function createTestAction(formData: FormData) { const title = String(formData.get("title") ?? ""); const timer = Number(formData.get("timer") ?? 30); return { ok: true, message: `Test '${title}' with ${timer}m created` }; }
