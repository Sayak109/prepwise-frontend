export type Role = "ADMIN" | "EDITOR" | "STUDENT";

export type QuestionType = "MCQ" | "SHORT_ANSWER" | "DESCRIPTIVE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  premium: boolean;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  premium: boolean;
  editorIds: string[];
  weakForUsers?: string[];
}

export interface QuestionOption {
  id: string;
  value: string;
}

export interface Question {
  id: string;
  topicId: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
  options?: QuestionOption[];
  answer: string;
  sampleAnswer?: string;
}

export interface Test {
  id: string;
  title: string;
  topicIds: string[];
  questionIds: string[];
  durationMinutes: number;
  premium: boolean;
}

export interface Attempt {
  id: string;
  userId: string;
  testId: string;
  score: number;
  total: number;
  accuracy: number;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}
