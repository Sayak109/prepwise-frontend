"use server";
export async function createQuestionAction(formData: FormData) {
  const prompt = String(formData.get("prompt") ?? "");
  const topicId = String(formData.get("topicId") ?? "");
  // Mock mutation. In your next step, wire this to NestJS.
  void prompt;
  void topicId;
}
