from pathlib import Path

root = Path(__file__).resolve().parents[1]

files = {
    "src/types/index.ts": """export type Role = "ADMIN" | "EDITOR" | "STUDENT";

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
""",
    "src/data/users.ts": """import { User } from "@/types";

export const users: User[] = [
  { id: "u-admin", name: "Admin One", email: "admin@prepwise.com", role: "ADMIN", premium: true },
  { id: "u-editor-1", name: "Editor A", email: "editor1@prepwise.com", role: "EDITOR", premium: true },
  { id: "u-editor-2", name: "Editor B", email: "editor2@prepwise.com", role: "EDITOR", premium: true },
  { id: "u-student-1", name: "Aarav", email: "student1@prepwise.com", role: "STUDENT", premium: false },
  { id: "u-student-2", name: "Maya", email: "student2@prepwise.com", role: "STUDENT", premium: true },
  { id: "u-student-3", name: "Ishan", email: "student3@prepwise.com", role: "STUDENT", premium: false },
  { id: "u-student-4", name: "Sara", email: "student4@prepwise.com", role: "STUDENT", premium: false },
  { id: "u-student-5", name: "Kabir", email: "student5@prepwise.com", role: "STUDENT", premium: true },
];
""",
    "src/data/topics.ts": """import { Topic } from "@/types";

export const topics: Topic[] = [
  { id: "t-math", title: "Algebra", description: "Linear equations and expressions", premium: false, editorIds: ["u-editor-1"], weakForUsers: ["u-student-1", "u-student-3"] },
  { id: "t-geo", title: "Geometry", description: "Triangles, circles and mensuration", premium: false, editorIds: ["u-editor-2"], weakForUsers: ["u-student-4"] },
  { id: "t-phy", title: "Physics Mechanics", description: "Motion, force and work", premium: true, editorIds: ["u-editor-1"], weakForUsers: ["u-student-1", "u-student-5"] },
  { id: "t-chem", title: "Organic Chemistry", description: "Hydrocarbons and reactions", premium: true, editorIds: ["u-editor-2"], weakForUsers: ["u-student-2"] },
  { id: "t-eng", title: "English Comprehension", description: "Reading and inference skills", premium: false, editorIds: ["u-editor-1", "u-editor-2"], weakForUsers: ["u-student-3"] },
];
""",
    "src/data/questions.ts": """import { Question } from "@/types";

export const questions: Question[] = [
  { id: "q1", topicId: "t-math", type: "MCQ", prompt: "Solve: 2x + 6 = 14", explanation: "Subtract 6 and divide by 2.", answer: "4", options: [{ id: "a", value: "2" }, { id: "b", value: "3" }, { id: "c", value: "4" }, { id: "d", value: "5" }] },
  { id: "q2", topicId: "t-math", type: "SHORT_ANSWER", prompt: "What is the value of x in x^2 = 49 (positive root)?", explanation: "Principal root of 49 is 7.", answer: "7" },
  { id: "q3", topicId: "t-geo", type: "DESCRIPTIVE", prompt: "Explain Pythagoras theorem in one paragraph.", explanation: "Used in right-angled triangles.", answer: "a2+b2=c2", sampleAnswer: "In a right triangle, square of the hypotenuse equals sum of squares of the other two sides." },
  { id: "q4", topicId: "t-phy", type: "MCQ", prompt: "SI unit of force is", explanation: "Force unit is Newton.", answer: "Newton", options: [{ id: "a", value: "Joule" }, { id: "b", value: "Newton" }, { id: "c", value: "Watt" }, { id: "d", value: "Pascal" }] },
  { id: "q5", topicId: "t-chem", type: "SHORT_ANSWER", prompt: "Name the first member of alkane series.", explanation: "CH4 is methane.", answer: "Methane" },
  { id: "q6", topicId: "t-eng", type: "DESCRIPTIVE", prompt: "How do you infer author tone from context?", explanation: "Use clue words and sentence framing.", answer: "context clues", sampleAnswer: "Read adjective choices, punctuation, and contrast markers to identify the author tone." },
  { id: "q7", topicId: "t-geo", type: "MCQ", prompt: "Angles in a triangle add up to", explanation: "Sum is always 180 degrees.", answer: "180", options: [{ id: "a", value: "90" }, { id: "b", value: "180" }, { id: "c", value: "360" }, { id: "d", value: "270" }] },
  { id: "q8", topicId: "t-phy", type: "SHORT_ANSWER", prompt: "State Newton's second law formula.", explanation: "Force equals mass times acceleration.", answer: "F=ma" },
  { id: "q9", topicId: "t-eng", type: "MCQ", prompt: "Antonym of 'brief'", explanation: "Opposite is lengthy/long.", answer: "Long", options: [{ id: "a", value: "Tiny" }, { id: "b", value: "Short" }, { id: "c", value: "Long" }, { id: "d", value: "Fast" }] },
  { id: "q10", topicId: "t-chem", type: "DESCRIPTIVE", prompt: "Why are isomers important?", explanation: "Same formula, different structures lead to different properties.", answer: "different structures", sampleAnswer: "Isomers matter because compounds with the same molecular formula can have different physical and chemical properties due to structural arrangement." },
];
""",
    "src/data/tests.ts": """import { Test } from "@/types";

export const tests: Test[] = [
  { id: "test-1", title: "Starter Math + Geometry", topicIds: ["t-math", "t-geo"], questionIds: ["q1", "q2", "q3", "q7"], durationMinutes: 20, premium: false },
  { id: "test-2", title: "Science Drill", topicIds: ["t-phy", "t-chem"], questionIds: ["q4", "q5", "q8", "q10"], durationMinutes: 25, premium: true },
  { id: "test-3", title: "Mixed Full Practice", topicIds: ["t-math", "t-geo", "t-phy", "t-eng"], questionIds: ["q1", "q3", "q4", "q6", "q9"], durationMinutes: 30, premium: false },
];
""",
    "src/data/attempts.ts": """import { Attempt } from "@/types";

export const attempts: Attempt[] = [
  { id: "a1", userId: "u-student-1", testId: "test-1", score: 3, total: 4, accuracy: 75, createdAt: "2026-04-15" },
  { id: "a2", userId: "u-student-1", testId: "test-3", score: 4, total: 5, accuracy: 80, createdAt: "2026-04-20" },
  { id: "a3", userId: "u-student-2", testId: "test-2", score: 3, total: 4, accuracy: 75, createdAt: "2026-04-18" },
  { id: "a4", userId: "u-student-3", testId: "test-1", score: 2, total: 4, accuracy: 50, createdAt: "2026-04-22" },
  { id: "a5", userId: "u-student-4", testId: "test-3", score: 3, total: 5, accuracy: 60, createdAt: "2026-04-25" },
];
""",
    "src/lib/constants.ts": """export const APP_NAME = "PrepWise";
export const AUTH_COOKIE = "prepwise_token";
export const REFRESH_COOKIE = "prepwise_refresh";
export const ROLE_COOKIE = "prepwise_role";
export const USER_COOKIE = "prepwise_user";
export const PUBLIC_PATHS = ["/login", "/register"];
""",
    "src/lib/auth.ts": """import { cookies } from "next/headers";
import { AUTH_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, USER_COOKIE } from "@/lib/constants";
import { Role } from "@/types";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  const role = cookieStore.get(ROLE_COOKIE)?.value as Role | undefined;
  const user = cookieStore.get(USER_COOKIE)?.value;
  return { token, refreshToken, role, user: user ? JSON.parse(user) : null, isAuthenticated: Boolean(token) };
}
""",
    "src/lib/route-access.ts": """import { Role } from "@/types";

export const roleHome: Record<Role, string> = { ADMIN: "/admin", EDITOR: "/editor", STUDENT: "/dashboard" };

export function roleCanAccessPath(role: Role | undefined, pathname: string) {
  if (!role) return false;
  if (pathname.startsWith("/admin")) return role === "ADMIN";
  if (pathname.startsWith("/editor")) return role === "EDITOR";
  if (["/dashboard", "/topics", "/practice", "/tests", "/results"].some((segment) => pathname.startsWith(segment))) {
    return role === "STUDENT" || role === "ADMIN" || role === "EDITOR";
  }
  return true;
}
""",
    "src/lib/query-client.ts": """import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } } });
}
""",
    "src/services/api-client.ts": """import axios from "axios";

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api", withCredentials: true });
let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error?.response?.status !== 401 || original?._retry) return Promise.reject(error);
    original._retry = true;
    if (refreshing) {
      await new Promise<void>((resolve) => queue.push(resolve));
      return api(original);
    }
    refreshing = true;
    try {
      await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
      queue.forEach((resolve) => resolve());
      queue = [];
      return api(original);
    } finally {
      refreshing = false;
    }
  }
);

export default api;
""",
    "src/services/mock-api.ts": """import { attempts } from "@/data/attempts";
import { questions } from "@/data/questions";
import { tests } from "@/data/tests";
import { topics } from "@/data/topics";
import { users } from "@/data/users";
const sleep = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
export async function fetchTopics() { await sleep(); return topics; }
export async function fetchTopicById(topicId: string) { await sleep(); return topics.find((t) => t.id === topicId) ?? null; }
export async function fetchQuestionsByTopic(topicId: string) { await sleep(); return questions.filter((q) => q.topicId === topicId); }
export async function fetchTests() { await sleep(); return tests; }
export async function fetchTestById(testId: string) { await sleep(); return tests.find((t) => t.id === testId) ?? null; }
export async function fetchQuestionsByIds(ids: string[]) { await sleep(); return questions.filter((q) => ids.includes(q.id)); }
export async function fetchUsers() { await sleep(); return users; }
export async function fetchAttemptsByUser(userId: string) { await sleep(); return attempts.filter((a) => a.userId === userId); }
""",
    "src/services/auth-service.ts": """import { users } from "@/data/users";
import { AuthResponse, Role } from "@/types";

export async function mockLogin(email: string): Promise<AuthResponse> {
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? users[3];
  return { token: `token-${user.id}`, refreshToken: `refresh-${user.id}`, user };
}
export async function mockRegister(name: string, email: string, role: Role): Promise<AuthResponse> {
  const user = { id: `u-${Date.now()}`, name, email, role, premium: false };
  return { token: `token-${user.id}`, refreshToken: `refresh-${user.id}`, user };
}
""",
    "src/app/providers.tsx": """"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { createQueryClient } from "@/lib/query-client";
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
""",
    "src/components/layout/app-footer.tsx": """export function AppFooter() {
  return (
    <footer className="border-t mt-8">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted-foreground flex flex-col gap-2 sm:flex-row sm:justify-between">
        <p>PrepWise by Your Name</p>
        <div className="flex gap-4">
          <a href="https://github.com/your-username" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          <a href="https://linkedin.com/in/your-username" target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
""",
    "src/components/layout/app-shell.tsx": """import Link from "next/link";
import { ReactNode } from "react";
import { AppFooter } from "@/components/layout/app-footer";
interface AppShellProps { title: string; nav: { href: string; label: string }[]; children: ReactNode; }
export function AppShell({ title, nav, children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{title}</h1>
          <nav className="flex flex-wrap gap-2 text-sm">
            {nav.map((item) => <Link key={item.href} className="px-3 py-1.5 rounded-md border hover:bg-muted" href={item.href}>{item.label}</Link>)}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
""",
    "src/components/layout/admin-layout.tsx": """import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
export function AdminLayout({ children }: { children: ReactNode }) {
  return <AppShell title="PrepWise Admin" nav={[{ href: "/admin", label: "Dashboard" }, { href: "/admin/user", label: "Users" }, { href: "/admin/topics", label: "Topics" }, { href: "/admin/tests", label: "Tests" }]}>{children}</AppShell>;
}
""",
    "src/components/layout/editor-layout.tsx": """import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
export function EditorLayout({ children }: { children: ReactNode }) {
  return <AppShell title="PrepWise Editor" nav={[{ href: "/editor", label: "Editor Home" }, { href: "/editor/questions", label: "Question Bank" }, { href: "/topics", label: "Topics" }]}>{children}</AppShell>;
}
""",
    "src/components/layout/student-layout.tsx": """import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
export function StudentLayout({ children }: { children: ReactNode }) {
  return <AppShell title="PrepWise Student" nav={[{ href: "/dashboard", label: "Dashboard" }, { href: "/topics", label: "Topics" }, { href: "/tests", label: "Tests" }, { href: "/results", label: "Results" }]}>{children}</AppShell>;
}
""",
    "src/hooks/use-topics.ts": """"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/services/mock-api";
export function useTopics() { return useQuery({ queryKey: ["topics"], queryFn: fetchTopics }); }
""",
    "src/hooks/use-tests.ts": """"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTestById, fetchTests } from "@/services/mock-api";
export function useTests() { return useQuery({ queryKey: ["tests"], queryFn: fetchTests }); }
export function useTest(testId: string) { return useQuery({ queryKey: ["tests", testId], queryFn: () => fetchTestById(testId), enabled: Boolean(testId) }); }
""",
    "src/components/questions/mcq-renderer.tsx": """"use client";
import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
export function MCQRenderer({ question }: { question: Question }) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct = selected.trim().toLowerCase() === question.answer.trim().toLowerCase();
  return <div className="space-y-3">
    {question.options?.map((opt) => <label key={opt.id} className="flex gap-2 rounded-md border p-2 cursor-pointer"><input type="radio" name={question.id} value={opt.value} onChange={(e) => setSelected(e.target.value)} /><span>{opt.value}</span></label>)}
    <Button onClick={() => setSubmitted(true)} disabled={!selected}>Submit</Button>
    {submitted ? <div className="rounded-md bg-muted p-3 text-sm"><p className={correct ? "text-green-600" : "text-red-600"}>{correct ? "Correct answer" : `Incorrect. Correct: ${question.answer}`}</p><p className="mt-1 text-muted-foreground">{question.explanation}</p></div> : null}
  </div>;
}
""",
    "src/components/questions/short-answer-renderer.tsx": """"use client";
import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
export function ShortAnswerRenderer({ question }: { question: Question }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct = value.trim().toLowerCase() === question.answer.trim().toLowerCase();
  return <div className="space-y-3">
    <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Type your answer" className="w-full rounded-md border bg-background px-3 py-2" />
    <Button onClick={() => setSubmitted(true)} disabled={!value}>Submit</Button>
    {submitted ? <div className="rounded-md bg-muted p-3 text-sm"><p className={correct ? "text-green-600" : "text-red-600"}>{correct ? "Exact match" : `Not exact. Expected: ${question.answer}`}</p><p className="mt-1 text-muted-foreground">{question.explanation}</p></div> : null}
  </div>;
}
""",
    "src/components/questions/descriptive-renderer.tsx": """"use client";
import { useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
export function DescriptiveRenderer({ question }: { question: Question }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return <div className="space-y-3">
    <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} placeholder="Write your detailed answer" className="w-full rounded-md border bg-background px-3 py-2" />
    <Button onClick={() => setSubmitted(true)} disabled={!value}>Submit</Button>
    {submitted ? <div className="rounded-md bg-muted p-3 text-sm"><p className="font-medium">Sample answer:</p><p className="mt-1 text-muted-foreground">{question.sampleAnswer ?? question.answer}</p><p className="mt-2 text-muted-foreground">{question.explanation}</p></div> : null}
  </div>;
}
""",
    "src/components/questions/question-card.tsx": """import { Question } from "@/types";
import { MCQRenderer } from "@/components/questions/mcq-renderer";
import { ShortAnswerRenderer } from "@/components/questions/short-answer-renderer";
import { DescriptiveRenderer } from "@/components/questions/descriptive-renderer";
export function QuestionCard({ question }: { question: Question }) {
  return <article className="rounded-xl border p-4 space-y-3 bg-card"><p className="text-xs text-muted-foreground">{question.type}</p><h3 className="font-medium">{question.prompt}</h3>{question.type === "MCQ" ? <MCQRenderer question={question} /> : null}{question.type === "SHORT_ANSWER" ? <ShortAnswerRenderer question={question} /> : null}{question.type === "DESCRIPTIVE" ? <DescriptiveRenderer question={question} /> : null}</article>;
}
""",
    "src/components/test/timer.tsx": """"use client";
import { useEffect, useState } from "react";
export function Timer({ initialSeconds, onEnd }: { initialSeconds: number; onEnd: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  useEffect(() => { if (secondsLeft <= 0) { onEnd(); return; } const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000); return () => clearInterval(id); }, [secondsLeft, onEnd]);
  const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const s = (secondsLeft % 60).toString().padStart(2, "0");
  return <div className="rounded-md border px-3 py-1 text-sm font-medium">Time Left: {m}:{s}</div>;
}
""",
    "src/components/test/result-summary.tsx": """export function ResultSummary({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  return <section className="rounded-xl border p-5 space-y-2 bg-card"><h3 className="text-lg font-semibold">Auto Result</h3><p>Score: {score}/{total}</p><p>Accuracy: {pct}%</p></section>;
}
""",
    "src/components/test/test-player.tsx": """"use client";
import { useMemo, useState } from "react";
import { Question } from "@/types";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/test/timer";
import { QuestionCard } from "@/components/questions/question-card";
import { ResultSummary } from "@/components/test/result-summary";
export function TestPlayer({ questions, durationMinutes }: { questions: Question[]; durationMinutes: number }) {
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const fakeScore = useMemo(() => Math.max(1, Math.floor(questions.length * 0.7)), [questions.length]);
  if (!started) return <Button onClick={() => setStarted(true)}>Start Test</Button>;
  if (submitted) return <ResultSummary score={fakeScore} total={questions.length} />;
  return <div className="grid gap-4 md:grid-cols-[220px_1fr]"><aside className="rounded-xl border p-3 space-y-3 h-fit"><Timer initialSeconds={durationMinutes * 60} onEnd={() => setSubmitted(true)} /><div className="grid grid-cols-4 md:grid-cols-2 gap-2">{questions.map((q, idx) => <button key={q.id} className={`rounded border px-2 py-1 text-xs ${idx === activeIndex ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setActiveIndex(idx)}>Q{idx + 1}</button>)}</div><Button className="w-full" onClick={() => setSubmitted(true)}>Submit Test</Button></aside><QuestionCard question={questions[activeIndex]} /></div>;
}
""",
    "src/components/dashboard/dashboard-charts.tsx": """"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, LineChart } from "recharts";
export function DashboardCharts({ accuracyData, attemptsData }: { accuracyData: { topic: string; accuracy: number }[]; attemptsData: { name: string; score: number }[] }) {
  return <div className="grid gap-4 lg:grid-cols-2"><section className="rounded-xl border p-4 bg-card"><h3 className="mb-3 font-semibold">Accuracy by Topic</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={accuracyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="topic" /><YAxis /><Tooltip /><Bar dataKey="accuracy" fill="hsl(var(--primary))" /></BarChart></ResponsiveContainer></div></section><section className="rounded-xl border p-4 bg-card"><h3 className="mb-3 font-semibold">Recent Attempts</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={attemptsData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line dataKey="score" stroke="hsl(var(--primary))" /></LineChart></ResponsiveContainer></div></section></div>;
}
""",
    "src/components/dashboard/lazy-dashboard-charts.tsx": """"use client";
import dynamic from "next/dynamic";
export const LazyDashboardCharts = dynamic(() => import("@/components/dashboard/dashboard-charts").then((mod) => mod.DashboardCharts), { ssr: false, loading: () => <div className="rounded-xl border p-4">Loading charts...</div> });
""",
    "src/app/actions/auth.ts": """"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { mockLogin, mockRegister } from "@/services/auth-service";
import { AUTH_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, USER_COOKIE } from "@/lib/constants";
import { Role } from "@/types";
export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const user = await mockLogin(email);
  const c = await cookies();
  c.set(AUTH_COOKIE, user.token, { httpOnly: true }); c.set(REFRESH_COOKIE, user.refreshToken, { httpOnly: true }); c.set(ROLE_COOKIE, user.user.role, { httpOnly: true }); c.set(USER_COOKIE, JSON.stringify(user.user), { httpOnly: true });
  if (user.user.role === "ADMIN") redirect("/admin");
  if (user.user.role === "EDITOR") redirect("/editor");
  redirect("/dashboard");
}
export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") ?? ""); const email = String(formData.get("email") ?? ""); const role = String(formData.get("role") ?? "STUDENT") as Role;
  const user = await mockRegister(name, email, role); const c = await cookies();
  c.set(AUTH_COOKIE, user.token, { httpOnly: true }); c.set(REFRESH_COOKIE, user.refreshToken, { httpOnly: true }); c.set(ROLE_COOKIE, user.user.role, { httpOnly: true }); c.set(USER_COOKIE, JSON.stringify(user.user), { httpOnly: true });
  redirect("/dashboard");
}
export async function logoutAction() { const c = await cookies(); c.delete(AUTH_COOKIE); c.delete(REFRESH_COOKIE); c.delete(ROLE_COOKIE); c.delete(USER_COOKIE); redirect("/login"); }
""",
    "src/app/actions/admin.ts": """"use server";
export async function createTopicAction(formData: FormData) { const title = String(formData.get("title") ?? ""); return { ok: true, message: `Topic '${title}' created` }; }
export async function createTestAction(formData: FormData) { const title = String(formData.get("title") ?? ""); const timer = Number(formData.get("timer") ?? 30); return { ok: true, message: `Test '${title}' with ${timer}m created` }; }
""",
    "src/app/actions/editor.ts": """"use server";
export async function createQuestionAction(formData: FormData) { const prompt = String(formData.get("prompt") ?? ""); const topicId = String(formData.get("topicId") ?? ""); return { ok: true, message: `Question added to ${topicId}`, prompt }; }
""",
    "src/components/forms/login-form.tsx": """import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
export function LoginForm() {
  return <form action={loginAction} className="space-y-4 rounded-xl border p-6 bg-card max-w-md w-full"><h2 className="text-xl font-semibold">Login to PrepWise</h2><input name="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" required /><input name="password" type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" required /><Button className="w-full" type="submit">Sign In</Button><p className="text-xs text-muted-foreground">Use mock emails like student1@prepwise.com or admin@prepwise.com.</p></form>;
}
""",
    "src/components/forms/register-form.tsx": """import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
export function RegisterForm() {
  return <form action={registerAction} className="space-y-4 rounded-xl border p-6 bg-card max-w-md w-full"><h2 className="text-xl font-semibold">Create account</h2><input name="name" placeholder="Full name" className="w-full rounded-md border px-3 py-2" required /><input name="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" required /><input name="password" type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" required /><select name="role" className="w-full rounded-md border px-3 py-2"><option value="STUDENT">Student</option><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option></select><Button className="w-full" type="submit">Register</Button></form>;
}
""",
    "src/app/layout.tsx": """import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
export const metadata: Metadata = { title: "PrepWise", description: "Adaptive exam preparation system frontend" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full"><Providers>{children}</Providers></body></html>;
}
""",
    "src/app/page.tsx": """import { redirect } from "next/navigation";
export default function Home() { redirect("/login"); }
""",
    "src/app/(auth)/login/page.tsx": """import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
export default function LoginPage() { return <main className="min-h-screen grid place-items-center px-4"><div className="space-y-3 w-full grid place-items-center"><LoginForm /><p className="text-sm">No account? <Link className="underline" href="/register">Register</Link></p></div></main>; }
""",
    "src/app/(auth)/register/page.tsx": """import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
export default function RegisterPage() { return <main className="min-h-screen grid place-items-center px-4"><div className="space-y-3 w-full grid place-items-center"><RegisterForm /><p className="text-sm">Already registered? <Link className="underline" href="/login">Login</Link></p></div></main>; }
""",
    "src/app/(student)/dashboard/page.tsx": """import { StudentLayout } from "@/components/layout/student-layout";
import { attempts } from "@/data/attempts"; import { topics } from "@/data/topics"; import { tests } from "@/data/tests"; import { users } from "@/data/users";
import { LazyDashboardCharts } from "@/components/dashboard/lazy-dashboard-charts";
export default async function DashboardPage() {
  const activeUser = users.find((u) => u.role === "STUDENT")!; const recentAttempts = attempts.filter((a) => a.userId === activeUser.id).slice(-5);
  const accuracyData = topics.map((topic) => ({ topic: topic.title.split(" ")[0], accuracy: Math.floor(Math.random() * 40) + 55 }));
  const attemptsData = recentAttempts.map((a) => ({ name: a.createdAt.slice(5), score: Math.round((a.score / a.total) * 100) }));
  const weakTopics = topics.filter((t) => t.weakForUsers?.includes(activeUser.id));
  return <StudentLayout><section className="grid gap-4 md:grid-cols-3 mb-6"><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Total Tests</p><p className="text-2xl font-bold">{tests.length}</p></div><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Recent Attempts</p><p className="text-2xl font-bold">{recentAttempts.length}</p></div><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Average Accuracy</p><p className="text-2xl font-bold">{Math.round(recentAttempts.reduce((s, c) => s + c.accuracy, 0) / Math.max(recentAttempts.length, 1))}%</p></div></section><LazyDashboardCharts accuracyData={accuracyData} attemptsData={attemptsData} /><section className="mt-6 rounded-xl border p-4"><h3 className="font-semibold mb-2">Weak Topics Indicator</h3><ul className="list-disc ml-5 text-sm text-muted-foreground">{weakTopics.map((topic) => <li key={topic.id}>{topic.title}</li>)}</ul></section></StudentLayout>;
}
""",
    "src/middleware.ts": """import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, PUBLIC_PATHS, ROLE_COOKIE } from "@/lib/constants";
import { roleCanAccessPath, roleHome } from "@/lib/route-access";
import { Role } from "@/types";
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl; const token = req.cookies.get(AUTH_COOKIE)?.value; const role = req.cookies.get(ROLE_COOKIE)?.value as Role | undefined;
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  if (!token && !isPublic) return NextResponse.redirect(new URL("/login", req.url));
  if (token && isPublic) return NextResponse.redirect(new URL(role ? roleHome[role] : "/dashboard", req.url));
  if (token && !roleCanAccessPath(role, pathname)) return NextResponse.redirect(new URL(role ? roleHome[role] : "/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
""",
    "src/app/(student)/topics/page.tsx": """"use client";
import Link from "next/link";
import { StudentLayout } from "@/components/layout/student-layout";
import { useTopics } from "@/hooks/use-topics";
export default function TopicsPage() {
  const { data, isLoading } = useTopics();
  return <StudentLayout><h2 className="text-2xl font-semibold mb-4">Topics</h2>{isLoading ? <p>Loading topics...</p> : null}<div className="grid gap-4 md:grid-cols-2">{data?.map((topic) => <article key={topic.id} className="rounded-xl border p-4 bg-card"><h3 className="font-medium">{topic.title}</h3><p className="text-sm text-muted-foreground my-2">{topic.description}</p><div className="flex gap-2"><Link className="underline text-sm" href={`/topics/${topic.id}`}>Open</Link><Link className="underline text-sm" href={`/practice/${topic.id}`}>Practice</Link></div></article>)}</div></StudentLayout>;
}
""",
    "src/app/(student)/topics/[topicId]/page.tsx": """import { notFound } from "next/navigation";
import { StudentLayout } from "@/components/layout/student-layout";
import { fetchQuestionsByTopic, fetchTopicById } from "@/services/mock-api";
import { QuestionCard } from "@/components/questions/question-card";
export default async function TopicDetailPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params; const topic = await fetchTopicById(topicId); if (!topic) notFound(); const topicQuestions = await fetchQuestionsByTopic(topicId);
  return <StudentLayout><h2 className="text-2xl font-semibold">{topic.title}</h2><p className="text-muted-foreground mb-4">{topic.description}</p><div className="space-y-4">{topicQuestions.map((question) => <QuestionCard key={question.id} question={question} />)}</div></StudentLayout>;
}
""",
    "src/app/(student)/practice/[topicId]/page.tsx": """import { StudentLayout } from "@/components/layout/student-layout";
import { fetchQuestionsByTopic, fetchTopicById } from "@/services/mock-api";
import { QuestionCard } from "@/components/questions/question-card";
export default async function PracticePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params; const topic = await fetchTopicById(topicId); const topicQuestions = await fetchQuestionsByTopic(topicId);
  return <StudentLayout><h2 className="text-2xl font-semibold mb-2">Practice: {topic?.title ?? topicId}</h2><p className="text-sm text-muted-foreground mb-4">Attempt and instantly review explanations.</p><div className="space-y-4">{topicQuestions.map((question) => <QuestionCard key={question.id} question={question} />)}</div></StudentLayout>;
}
""",
    "src/app/(student)/tests/page.tsx": """"use client";
import Link from "next/link";
import { StudentLayout } from "@/components/layout/student-layout";
import { useTests } from "@/hooks/use-tests";
export default function TestsPage() {
  const { data, isLoading } = useTests();
  return <StudentLayout><h2 className="text-2xl font-semibold mb-4">Tests</h2>{isLoading ? <p>Loading tests...</p> : null}<div className="grid gap-4 md:grid-cols-2">{data?.map((test) => <article key={test.id} className="rounded-xl border p-4 bg-card"><h3 className="font-semibold">{test.title}</h3><p className="text-sm text-muted-foreground">Duration: {test.durationMinutes} min</p><p className="text-sm text-muted-foreground mb-2">Premium: {test.premium ? "Yes" : "No"}</p><Link href={`/tests/${test.id}`} className="underline text-sm">Open test</Link></article>)}</div></StudentLayout>;
}
""",
    "src/app/(student)/tests/[testId]/page.tsx": """import { notFound } from "next/navigation";
import { StudentLayout } from "@/components/layout/student-layout";
import { TestPlayer } from "@/components/test/test-player";
import { fetchQuestionsByIds, fetchTestById } from "@/services/mock-api";
export default async function TestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params; const test = await fetchTestById(testId); if (!test) notFound(); const testQuestions = await fetchQuestionsByIds(test.questionIds);
  return <StudentLayout><h2 className="text-2xl font-semibold mb-4">{test.title}</h2><TestPlayer questions={testQuestions} durationMinutes={test.durationMinutes} /></StudentLayout>;
}
""",
    "src/app/(student)/results/page.tsx": """import { StudentLayout } from "@/components/layout/student-layout";
import { attempts } from "@/data/attempts"; import { tests } from "@/data/tests";
export default function ResultsPage() {
  return <StudentLayout><h2 className="text-2xl font-semibold mb-4">Results</h2><div className="space-y-3">{attempts.map((attempt) => { const test = tests.find((t) => t.id === attempt.testId); return <article key={attempt.id} className="rounded-xl border p-4"><h3 className="font-medium">{test?.title}</h3><p className="text-sm text-muted-foreground">Date: {attempt.createdAt}</p><p className="text-sm">Score: {attempt.score}/{attempt.total} ({attempt.accuracy}%)</p></article>; })}</div></StudentLayout>;
}
""",
    "src/app/(admin)/admin/page.tsx": """import { AdminLayout } from "@/components/layout/admin-layout";
import { tests } from "@/data/tests"; import { topics } from "@/data/topics"; import { users } from "@/data/users";
export default function AdminPage() {
  const editors = users.filter((u) => u.role === "EDITOR");
  return <AdminLayout><h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2><div className="grid gap-4 md:grid-cols-3"><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Users</p><p className="text-2xl font-bold">{users.length}</p></div><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Topics</p><p className="text-2xl font-bold">{topics.length}</p></div><div className="rounded-xl border p-4"><p className="text-sm text-muted-foreground">Tests</p><p className="text-2xl font-bold">{tests.length}</p></div></div><section className="mt-6 rounded-xl border p-4"><h3 className="font-semibold mb-2">Editor Topic Permissions</h3><ul className="text-sm space-y-1">{editors.map((editor) => <li key={editor.id}>{editor.name} - {topics.filter((topic) => topic.editorIds.includes(editor.id)).map((topic) => topic.title).join(", ")}</li>)}</ul></section></AdminLayout>;
}
""",
    "src/app/(admin)/admin/user/page.tsx": """import { AdminLayout } from "@/components/layout/admin-layout";
import { users } from "@/data/users";
export default function AdminUsersPage() {
  return <AdminLayout><h2 className="text-2xl font-semibold mb-4">Manage Users / Editors</h2><div className="rounded-xl border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted"><tr><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Email</th><th className="text-left px-3 py-2">Role</th><th className="text-left px-3 py-2">Premium</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t"><td className="px-3 py-2">{user.name}</td><td className="px-3 py-2">{user.email}</td><td className="px-3 py-2">{user.role}</td><td className="px-3 py-2">{user.premium ? "Yes" : "No"}</td></tr>)}</tbody></table></div></AdminLayout>;
}
""",
    "src/app/(admin)/admin/topics/page.tsx": """import { AdminLayout } from "@/components/layout/admin-layout";
import { createTopicAction } from "@/app/actions/admin";
import { topics } from "@/data/topics";
import { Button } from "@/components/ui/button";
export default function AdminTopicsPage() {
  return <AdminLayout><h2 className="text-2xl font-semibold mb-4">Create / Manage Topics</h2><form action={createTopicAction} className="rounded-xl border p-4 bg-card space-y-3 mb-6"><input name="title" placeholder="Topic title" className="w-full rounded-md border px-3 py-2" required /><textarea name="description" placeholder="Topic description" className="w-full rounded-md border px-3 py-2" rows={3} required /><Button type="submit">Create Topic</Button></form><div className="grid gap-3 md:grid-cols-2">{topics.map((topic) => <article key={topic.id} className="rounded-xl border p-4"><h3 className="font-medium">{topic.title}</h3><p className="text-sm text-muted-foreground">Premium: {topic.premium ? "Yes" : "No"}</p></article>)}</div></AdminLayout>;
}
""",
    "src/app/(admin)/admin/tests/page.tsx": """import { AdminLayout } from "@/components/layout/admin-layout";
import { createTestAction } from "@/app/actions/admin";
import { tests } from "@/data/tests";
import { Button } from "@/components/ui/button";
export default function AdminTestsPage() {
  return <AdminLayout><h2 className="text-2xl font-semibold mb-4">Create Tests / Set Timer</h2><form action={createTestAction} className="rounded-xl border p-4 bg-card space-y-3 mb-6"><input name="title" placeholder="Test title" className="w-full rounded-md border px-3 py-2" required /><input name="timer" type="number" defaultValue={30} className="w-full rounded-md border px-3 py-2" required /><label className="text-sm flex items-center gap-2"><input type="checkbox" name="premium" /> Mark premium content</label><Button type="submit">Create Test</Button></form><div className="space-y-3">{tests.map((test) => <article key={test.id} className="rounded-xl border p-4"><h3 className="font-medium">{test.title}</h3><p className="text-sm text-muted-foreground">Timer: {test.durationMinutes} min | Premium: {test.premium ? "Yes" : "No"}</p></article>)}</div></AdminLayout>;
}
""",
    "src/app/(editor)/editor/page.tsx": """import { EditorLayout } from "@/components/layout/editor-layout";
import { topics } from "@/data/topics";
export default function EditorHomePage() {
  return <EditorLayout><h2 className="text-2xl font-semibold mb-4">Editor Home</h2><p className="text-sm text-muted-foreground mb-4">Editors can create and update questions for assigned topics only.</p><div className="grid gap-3 md:grid-cols-2">{topics.map((topic) => <article key={topic.id} className="rounded-xl border p-4"><h3 className="font-medium">{topic.title}</h3><p className="text-sm text-muted-foreground">Assigned Editors: {topic.editorIds.join(", ")}</p></article>)}</div></EditorLayout>;
}
""",
    "src/app/(editor)/editor/questions/page.tsx": """import { createQuestionAction } from "@/app/actions/editor";
import { EditorLayout } from "@/components/layout/editor-layout";
import { questions } from "@/data/questions";
import { topics } from "@/data/topics";
import { Button } from "@/components/ui/button";
export default function EditorQuestionsPage() {
  return <EditorLayout><h2 className="text-2xl font-semibold mb-4">Create / Edit Questions</h2><form action={createQuestionAction} className="rounded-xl border p-4 bg-card space-y-3 mb-6"><select name="topicId" className="w-full rounded-md border px-3 py-2">{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select><select name="type" className="w-full rounded-md border px-3 py-2"><option value="MCQ">MCQ</option><option value="SHORT_ANSWER">SHORT_ANSWER</option><option value="DESCRIPTIVE">DESCRIPTIVE</option></select><textarea name="prompt" placeholder="Question prompt" className="w-full rounded-md border px-3 py-2" rows={3} required /><Button type="submit">Save Question</Button></form><div className="space-y-3">{questions.map((question) => <article key={question.id} className="rounded-xl border p-4"><p className="text-xs text-muted-foreground">{question.type}</p><h3 className="font-medium">{question.prompt}</h3></article>)}</div></EditorLayout>;
}
""",
}

for rel, content in files.items():
    p = root / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content, encoding="utf-8")

print(f"Wrote {len(files)} files.")
