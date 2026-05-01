"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { HtmlBlock } from "@/components/shared/html-block";
import { ChevronDown } from "lucide-react";

type AttemptQuestion = {
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
};

export function TestResultsView({
  testId,
  testTitle,
  score,
  totalQuestions,
  answered,
  questions,
}: {
  testId: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
  answered: number;
  questions: AttemptQuestion[];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const accuracy = useMemo(() => {
    const pct = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;
    return Math.max(0, Math.min(100, pct));
  }, [score, totalQuestions]);

  const band =
    accuracy >= 85
      ? "Excellent"
      : accuracy >= 70
        ? "Good"
        : accuracy >= 50
          ? "Needs Improvement"
          : "Focus Required";

  const ordered = useMemo(() => {
    return [...questions].sort(
      (a, b) =>
        (a.options?.[0]?.displayOrder ?? 0) -
        (b.options?.[0]?.displayOrder ?? 0),
    );
  }, [questions]);

  return (
    <main className="max-w-[1113px] mx-auto px-[20px] py-12">
      <div className="mb-12">
        <p className="text-[#1f108e] uppercase tracking-[0.18em] text-xs font-bold mb-1">
          {testTitle}
        </p>
        <h1 className="text-[40px] leading-tight font-bold text-[#1b1b22] mb-1">
          Result: Test submitted
        </h1>
        <p className="text-[#464553] text-base mb-6">
          Your score has been calculated from the answers submitted in this
          attempt.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[#c8c4d5]">
            <p className="text-[#464553] uppercase tracking-wider text-xs font-bold mb-2">
              SCORE
            </p>
            <p className="text-4xl font-bold text-[#1f108e]">{score}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#c8c4d5]">
            <p className="text-[#464553] uppercase tracking-wider text-xs font-bold mb-2">
              TOTAL
            </p>
            <p className="text-4xl font-bold text-[#1f108e]">
              {totalQuestions}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#c8c4d5]">
            <p className="text-[#464553] uppercase tracking-wider text-xs font-bold mb-2">
              ACCURACY
            </p>
            <p className="text-4xl font-bold text-[#1f108e]">{accuracy}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[#c8c4d5]">
            <p className="text-[#464553] uppercase tracking-wider text-xs font-bold mb-2">
              ATTEMPTED
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-bold text-[#1f108e]">{answered}</p>
              <p className="text-xl font-medium text-[#464553]">
                /{totalQuestions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#c8c4d5] mb-12">
          <div className="w-full h-3 bg-[#f0ecf6] rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-[#1f108e]/20 rounded-full"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <p className="text-base text-[#1b1b22]">
            Performance band: <span className="font-bold">{band}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            href={`/tests/${testId}`}
            className="px-6 py-3 border border-[#1f108e] text-[#1f108e] font-medium rounded-lg hover:bg-[#1f108e]/5 transition-all"
          >
            Retake Test
          </Link>
          <Link
            href="/tests"
            className="px-6 py-3 bg-[#1f108e] text-white font-medium rounded-lg hover:opacity-95 transition-all"
          >
            Back to Exams
          </Link>
          {/* <Link
            href="/results"
            className="px-6 py-3 bg-[#f6f2fc] border border-[#c8c4d5] text-[#1b1b22] font-medium rounded-lg hover:bg-[#f0ecf6] transition-all"
          >
            Open Full Results Dashboard
          </Link> */}
        </div>
      </div>

      <div className="space-y-12">
        <h2 className="text-[30px] leading-snug font-semibold text-[#1b1b22] border-b border-[#e4e1eb] pb-6">
          Detailed Review
        </h2>

        {ordered.map((q, idx) => {
          const optionList = (q.options ?? [])
            .slice()
            .sort((a, b) => a.displayOrder - b.displayOrder);
          const selected = q.selectedOptionId ?? null;
          const correctOpt = q.correctOptionId ?? null;
          const isMcq = q.type === "MCQ";
          const isCorrectMcq =
            isMcq && selected && correctOpt && selected === correctOpt;

          const shortExpected = q.correctAnswer?.trim() ?? "";
          const shortActual = (q.answerText ?? "").trim();
          const isShortCorrect =
            q.type === "SHORT_ANSWER" && shortExpected
              ? shortExpected.toLowerCase() === shortActual.toLowerCase()
              : false;

          const show = Boolean(open[q.id]);
          const toggle = () => setOpen((p) => ({ ...p, [q.id]: !p[q.id] }));

          return (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-[#c8c4d5] overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-[24px] leading-snug font-semibold text-[#1b1b22] mb-6">
                  {idx + 1}. {q.questionText}
                </h3>

                {q.type === "MCQ" ? (
                  <div className="space-y-3 mb-6">
                    {optionList.map((opt, optIdx) => {
                      const letter = String.fromCharCode(65 + optIdx);
                      const isSelected = selected === opt.id;
                      const isCorrect = correctOpt === opt.id;

                      // Exact behavior as your HTML: show wrong selected + show correct option
                      const wrongSelected = isSelected && !isCorrect;

                      if (wrongSelected) {
                        return (
                          <div
                            key={opt.id}
                            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#752c00] text-white border border-transparent"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white font-bold text-[#752c00]">
                                {letter}
                              </div>
                              <span className="text-base">
                                {opt.optionText}
                              </span>
                            </div>
                            <span className="text-white font-bold">✕</span>
                          </div>
                        );
                      }

                      if (isCorrect) {
                        return (
                          <div
                            key={opt.id}
                            className="flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-[#1f108e] bg-[#1f108e]/5"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1f108e] font-bold text-white">
                                {letter}
                              </div>
                              <span className="text-base text-[#1b1b22] font-medium">
                                {opt.optionText}
                              </span>
                            </div>
                            <span className="text-[#1f108e] font-bold">✓</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={opt.id}
                          className="flex items-center gap-4 p-4 rounded-xl border border-[#c8c4d5] bg-white"
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-full border border-[#c8c4d5] font-bold text-[#1b1b22]">
                            {letter}
                          </div>
                          <span className="text-base text-[#1b1b22]">
                            {opt.optionText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {q.type === "SHORT_ANSWER" ? (
                  <div className="mb-6">
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[#c8c4d5] bg-white">
                      <span className="text-[#464553] text-sm">
                        Your answer:{" "}
                        <span className="font-semibold text-[#1b1b22]">
                          {shortActual || "—"}
                        </span>
                      </span>
                      {shortActual ? (
                        isShortCorrect ? (
                          <span className="text-[#1f108e] font-bold">✓</span>
                        ) : (
                          <span className="text-[#752c00] font-bold">✕</span>
                        )
                      ) : null}
                    </div>
                    {!isShortCorrect && shortExpected ? (
                      <p className="mt-2 text-sm text-[#464553]">
                        Expected:{" "}
                        <span className="font-semibold text-[#1b1b22]">
                          {shortExpected}
                        </span>
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {q.type === "DESCRIPTIVE" ? (
                  <div className="mb-6">
                    <div className="p-4 rounded-xl border border-[#c8c4d5] bg-white">
                      <p className="text-sm text-[#464553] mb-1">Your answer</p>
                      <p className="text-base text-[#1b1b22] whitespace-pre-wrap">
                        {q.answerText ?? "—"}
                      </p>
                    </div>
                    {(q.sampleAnswer ?? q.correctAnswer) ? (
                      <div className="mt-3 p-4 rounded-xl border border-[#c8c4d5] bg-[#f6f2fc]">
                        <p className="text-sm text-[#464553] mb-1">
                          Sample answer
                        </p>
                        <p className="text-base text-[#1b1b22] whitespace-pre-wrap">
                          {q.sampleAnswer ?? q.correctAnswer}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={toggle}
                  className="flex items-center gap-2 cursor-pointer text-[#1f108e] font-medium hover:underline select-none"
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform ${show ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                  {show ? "Hide Explanation" : "Show Explanation"}
                </button>

                {show ? (
                  <div className="mt-4 p-6 bg-[#f6f2fc] rounded-xl text-[#464553] text-sm leading-relaxed border-l-4 border-[#1f108e]">
                    <HtmlBlock html={q.explanation ?? ""} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
