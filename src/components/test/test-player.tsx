"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Question } from "@/types";
import { Timer } from "@/components/test/timer";
import { Clock3, Flag, Info, MoveLeft, MoveRight } from "lucide-react";
import styles from "@/components/test/test-player.module.css";
import { StudentTopNav } from "@/components/layout/student-top-nav";
import { AppFooter } from "@/components/layout/app-footer";
import { completeTestAttempt, flagTestQuestion, saveTestAnswer } from "@/services/student-api";

interface TestPlayerProps {
  testId: string;
  attemptId: string;
  testTitle: string;
  questions: Question[];
  durationMinutes: number;
}

export function TestPlayer({
  testId,
  attemptId,
  testTitle,
  questions,
  durationMinutes,
}: TestPlayerProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const activeQuestion = questions[activeIndex];
  const answeredCount = Object.keys(answers).length;
  const total = questions.length;
  const progressPct = total ? Math.round((answeredCount / total) * 100) : 0;
  const score = useMemo(() => {
    return questions.reduce((sum, q) => {
      const userAnswer = (answers[q.id] ?? "").trim().toLowerCase();
      const correct = q.answer.trim().toLowerCase();
      if (!userAnswer) return sum;
      if (q.type === "DESCRIPTIVE") return userAnswer.includes(correct) ? sum + 1 : sum;
      return userAnswer === correct ? sum + 1 : sum;
    }, 0);
  }, [answers, questions]);
  const accuracy = Math.round((score / Math.max(total, 1)) * 100);

  async function submitTest() {
    if (attemptId) {
      await completeTestAttempt(attemptId);
    }
    router.push(
      `/tests/${testId}/results?score=${score}&total=${total}&accuracy=${accuracy}&answered=${answeredCount}`
    );
  }

  async function persistAnswer(questionId: string, value: string, selectedOptionId?: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (!attemptId) return;
    await saveTestAnswer({
      attemptId,
      questionId,
      selectedOptionId,
      answerText: selectedOptionId ? undefined : value,
    });
  }

  async function toggleFlag(questionId: string) {
    const flagged = !flags[questionId];
    setFlags((prev) => ({ ...prev, [questionId]: flagged }));
    if (attemptId) {
      await flagTestQuestion(attemptId, questionId, flagged);
    }
  }

  return (
    <div className={styles.page}>
      <StudentTopNav
        subtitle={testTitle}
        rightSlot={
          <div className={styles.timerChip}>
            <Clock3 size={18} />
            <Timer
              compact
              initialSeconds={durationMinutes * 60}
              onEnd={submitTest}
            />
            <button className={styles.primaryButton} onClick={submitTest}>
              Submit Test
            </button>
          </div>
        }
      />

      <main className={styles.canvas}>
        <section className={styles.questionSection}>
          <div className={styles.questionMeta}>
            <span className={styles.questionPill}>
              Question {String(activeIndex + 1).padStart(2, "0")} of {questions.length}
            </span>
            <span className={styles.points}>
              <Info size={14} /> 4 Points
            </span>
          </div>

          <article className={styles.questionCard}>
            <h2 className={styles.questionPrompt}>{activeQuestion?.prompt ?? "No questions available for this test."}</h2>

            {activeQuestion?.type === "MCQ" ? (
              <div className={styles.optionsWrap}>
                {activeQuestion.options?.map((opt) => {
                  const checked = answers[activeQuestion.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`${styles.option} ${checked ? styles.optionSelected : ""}`}
                    >
                      <input
                        className={styles.optionInput}
                        type="radio"
                        name={activeQuestion.id}
                        value={opt.id}
                        checked={checked}
                        onChange={(e) =>
                          void persistAnswer(activeQuestion.id, e.target.value, e.target.value)
                        }
                      />
                      <span className={styles.optionText}>{opt.value}</span>
                    </label>
                  );
                })}
              </div>
            ) : null}

            {activeQuestion?.type === "SHORT_ANSWER" ? (
              <input
                className={styles.textInput}
                placeholder="Type your exact answer"
                value={answers[activeQuestion.id] ?? ""}
                onChange={(e) =>
                  void persistAnswer(activeQuestion.id, e.target.value)
                }
              />
            ) : null}

            {activeQuestion?.type === "DESCRIPTIVE" ? (
              <textarea
                className={styles.textArea}
                rows={6}
                placeholder="Write your descriptive answer"
                value={answers[activeQuestion.id] ?? ""}
                onChange={(e) =>
                  void persistAnswer(activeQuestion.id, e.target.value)
                }
              />
            ) : null}
          </article>

          <div className={styles.actions}>
            <button
              className={styles.ghostButton}
              onClick={() => setActiveIndex((v) => Math.max(0, v - 1))}
            >
              <MoveLeft size={16} /> Previous
            </button>

            <button
              className={styles.flagButton}
              disabled={!activeQuestion}
              onClick={() => activeQuestion ? void toggleFlag(activeQuestion.id) : undefined}
            >
              <Flag size={16} />
              {activeQuestion && flags[activeQuestion.id] ? "Remove Flag" : "Flag for Review"}
            </button>

            <button
              className={styles.primaryButton}
              disabled={!questions.length}
              onClick={() => setActiveIndex((v) => Math.min(questions.length - 1, v + 1))}
            >
              Next <MoveRight size={16} />
            </button>
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div>
            <p className={styles.sidebarHeading}>Test Progress</p>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressValue}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className={styles.progressMeta}>
              <span>{answeredCount} Answered</span>
              <span>{questions.length} Total</span>
            </div>
          </div>

          <div className={styles.navGrid}>
            {questions.map((q, idx) => {
              const isCurrent = idx === activeIndex;
              const isAnswered = Boolean(answers[q.id]);
              const isFlagged = Boolean(flags[q.id]);
              const cls = isCurrent
                ? styles.navCurrent
                : isFlagged
                  ? styles.navFlagged
                  : isAnswered
                    ? styles.navAnswered
                    : styles.navPlain;
              return (
                <button
                  key={q.id}
                  className={`${styles.navCell} ${cls}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className={styles.legend}>
            <h3>Legend</h3>
            <div className={styles.legendGrid}>
              <p><span className={`${styles.dot} ${styles.dotAnswered}`} />Answered</p>
              <p><span className={`${styles.dot} ${styles.dotFlagged}`} />Flagged</p>
              <p><span className={`${styles.dot} ${styles.dotPlain}`} />Not Visited</p>
              <p><span className={`${styles.dot} ${styles.dotCurrent}`} />Current</p>
            </div>
          </div>
        </aside>
      </main>

      <AppFooter />
    </div>
  );
}
