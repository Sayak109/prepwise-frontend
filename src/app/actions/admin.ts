"use server";
export async function createTopicAction(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  // Mock mutation. In your next step, wire this to NestJS.
  void title;
}

export async function createTestAction(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  const timer = Number(formData.get("timer") ?? 30);
  // Mock mutation. In your next step, wire this to NestJS.
  void title;
  void timer;
}
