import api from "@/services/api-client";
import type { Question, Test, Topic } from "@/types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type BackendTopic = {
  id: string;
  title: string;
  description?: string | null;
  isPremium?: boolean;
  _count?: { questions?: number };
};

type BackendQuestion = {
  id: string;
  topicId: string;
  type: Question["type"];
  questionText: string;
  explanation?: string | null;
  correctOptionId?: string | null;
  correctAnswer?: string | null;
  sampleAnswer?: string | null;
  options?: Array<{ id: string; optionText: string }>;
  correctOption?: { id: string; optionText: string } | null;
};

type BackendTest = {
  id: string;
  title: string;
  topicId?: string | null;
  difficulty?: Test["difficulty"] | null;
  isTimed?: boolean;
  durationSeconds?: number | null;
  isPremium?: boolean;
  _count?: { questions?: number };
  questions?: Array<{
    question?: BackendQuestion;
    points?: string | number;
  }>;
};

type Attempt = {
  id: string;
  testId: string;
  score: string | number;
  status: string;
  timeRemainingSeconds?: number | null;
  test: BackendTest;
  summary: {
    totalQuestions: number;
    answered: number;
    flagged: number;
    notVisited: number;
  };
  questions: Array<BackendQuestion & {
    selectedOptionId?: string | null;
    answerText?: string | null;
    state?: string;
    points?: string | number;
  }>;
};

function unwrap<T>(response: { data: ApiResponse<T> }) {
  return response.data.data;
}

export function mapTopic(topic: BackendTopic): Topic {
  return {
    id: topic.id,
    title: topic.title,
    description: topic.description ?? "",
    premium: Boolean(topic.isPremium),
    editorIds: [],
    questionCount: topic._count?.questions ?? 0,
  };
}

export function mapQuestion(question: BackendQuestion): Question {
  const correctFromOptions =
    question.correctOptionId && question.options
      ? question.options.find((o) => o.id === question.correctOptionId)?.optionText
      : undefined;
  const correctFromRelation = question.correctOption?.optionText ?? undefined;
  const correct =
    question.correctAnswer ??
    correctFromOptions ??
    correctFromRelation ??
    "";

  return {
    id: question.id,
    topicId: question.topicId,
    type: question.type,
    prompt: question.questionText,
    explanation: question.explanation ?? "Explanation is not available yet.",
    options: question.options?.map((option) => ({
      id: option.id,
      value: option.optionText,
    })),
    answer: correct,
    sampleAnswer: question.sampleAnswer ?? correct,
  };
}

export function mapTest(test: BackendTest): Test {
  return {
    id: test.id,
    title: test.title,
    topicIds: test.topicId ? [test.topicId] : [],
    questionIds: test.questions?.map((item) => item.question?.id).filter(Boolean) as string[] ?? [],
    questionCount: test._count?.questions ?? test.questions?.length ?? 0,
    durationMinutes: Math.max(1, Math.round((test.durationSeconds ?? 1800) / 60)),
    difficulty: test.difficulty ?? undefined,
    premium: Boolean(test.isPremium),
  };
}

export async function fetchTopics() {
  const response = await api.get<ApiResponse<{ topics: BackendTopic[] }>>("/practice/topics", {
    params: { limit: 100, includeQuestions: false },
  });
  return unwrap(response).topics.map(mapTopic);
}

export async function startTopicPractice(topicId: string) {
  const response = await api.get<ApiResponse<{ topic: BackendTopic; questions: BackendQuestion[] }>>(
    `/practice/topics/${topicId}/start`,
    { params: { limit: 20 } },
  );
  const data = unwrap(response);
  return {
    topic: mapTopic(data.topic),
    questions: data.questions.map(mapQuestion),
  };
}

export async function fetchTests(params?: { search?: string; difficulty?: Test["difficulty"] }) {
  const response = await api.get<ApiResponse<{ tests: BackendTest[] }>>("/test", {
    params: {
      limit: 100,
      search: params?.search || undefined,
      difficulty: params?.difficulty,
    },
  });
  return unwrap(response).tests.map(mapTest);
}

export async function startTest(testId: string) {
  const response = await api.post<ApiResponse<Attempt>>(`/test/${testId}/start`);
  return unwrap(response);
}

export async function saveTestAnswer({
  attemptId,
  questionId,
  selectedOptionId,
  answerText,
}: {
  attemptId: string;
  questionId: string;
  selectedOptionId?: string;
  answerText?: string;
}) {
  const response = await api.patch<ApiResponse<Attempt>>(
    `/test/attempts/${attemptId}/questions/${questionId}/answer`,
    { selectedOptionId, answerText },
  );
  return unwrap(response);
}

export async function flagTestQuestion(attemptId: string, questionId: string, flagged: boolean) {
  const response = await api.patch<ApiResponse<Attempt>>(
    `/test/attempts/${attemptId}/questions/${questionId}/flag`,
    { flagged },
  );
  return unwrap(response);
}

export async function completeTestAttempt(attemptId: string) {
  const response = await api.post<ApiResponse<Attempt>>(`/test/attempts/${attemptId}/complete`, {
    answers: [],
  });
  return unwrap(response);
}

export async function completeTestAttemptWithAnswers(
  attemptId: string,
  answers: Array<{ questionId: string; selectedOptionId?: string; answerText?: string }>,
) {
  const response = await api.post<ApiResponse<Attempt>>(`/test/attempts/${attemptId}/complete`, {
    answers,
  });
  return unwrap(response);
}

export type TestAttempt = Attempt;
