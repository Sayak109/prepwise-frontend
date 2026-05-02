import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { AxiosError } from "axios";
import { AUTH_COOKIE } from "@/lib/constants";
import { serverApiUrl } from "@/lib/api-url";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

async function authHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function get<T>(path: string) {
  try {
    const response = await axios.get<ApiResponse<T>>(serverApiUrl(path), {
      headers: await authHeaders(),
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    const status = error instanceof AxiosError ? error.response?.status : undefined;
    if (status === 400 || status === 401) {
      // Cookie writes are only allowed in Route Handlers / Server Actions, not during RSC data fetch.
      redirect("/api/auth/clear-session");
    }
    throw error;
  }
}

export type TestAttempt = {
  id: string;
  testId: string;
  score: string | number;
  status: string;
  timeRemainingSeconds?: number | null;
  test: {
    id: string;
    title: string;
    topicId?: string | null;
    difficulty?: string | null;
    isTimed?: boolean;
    durationSeconds?: number | null;
    isPremium?: boolean;
  };
  summary: {
    totalQuestions: number;
    answered: number;
    flagged: number;
    notVisited: number;
  };
  questions: Array<{
    id: string;
    topicId: string;
    type: "MCQ" | "SHORT_ANSWER" | "DESCRIPTIVE";
    questionText: string;
    explanation?: string | null;
    correctOptionId?: string | null;
    correctAnswer?: string | null;
    sampleAnswer?: string | null;
    options?: Array<{ id: string; optionText: string; displayOrder: number }>;
    selectedOptionId?: string | null;
    answerText?: string | null;
    state?: string;
    points?: string | number;
    displayOrder?: number;
  }>;
};

export async function fetchTestAttempt(attemptId: string) {
  return await get<TestAttempt>(`/test/attempts/${attemptId}`);
}

export type DashboardData = {
  stats: {
    overallScore: number;
    testsCompleted: number;
    totalTests: number;
    testsCompletedPercent: number;
    studyStreak: {
      currentDays: number;
      highestDays: number;
    };
  };
  recentAttempts: Array<{
    id: string;
    testId: string;
    title: string;
    attemptedDate: string;
    scorePercent: number;
    result: "PASSED" | "FAILED";
  }>;
};

export async function fetchDashboard() {
  try {
    return await get<DashboardData>("/dashboard");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to load dashboard data", error);
    } else {
      throw error;
    }
    return {
      stats: {
        overallScore: 0,
        testsCompleted: 0,
        totalTests: 0,
        testsCompletedPercent: 0,
        studyStreak: {
          currentDays: 0,
          highestDays: 0,
        },
      },
      recentAttempts: [],
    };
  }
}

export async function fetchAttemptHistory() {
  try {
    return await get<{ attempts: DashboardData["recentAttempts"] }>("/dashboard/recent-attempts?limit=20");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to load attempt history", error);
      return { attempts: [] };
    }
    throw error;
  }
}
