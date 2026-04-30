"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Clock3,
  Flag,
  Home,
  Lightbulb,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { AppFooter } from "@/components/layout/app-footer";
import { StudentTopNav } from "@/components/layout/student-top-nav";
import type { Question } from "@/types";
import styles from "@/components/practice/practice-session.module.css";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function PracticeSession({
  topicTitle,
  questions,
}: {
  topicTitle: string;
  questions: Question[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const q = questions[activeIndex];

  const [mcqAnswer, setMcqAnswer] = useState<string>("");
  const [shortAnswer, setShortAnswer] = useState<string>("");
  const [descriptive, setDescriptive] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const isAnswered = useMemo(() => {
    if (!q) return false;
    if (q.type === "MCQ") return Boolean(mcqAnswer);
    if (q.type === "SHORT_ANSWER") return Boolean(shortAnswer.trim());
    return Boolean(descriptive.trim());
  }, [q, mcqAnswer, shortAnswer, descriptive]);

  const evaluation = useMemo(() => {
    if (!submitted || !q) return null;
    if (q.type === "MCQ") {
      const correct = normalize(mcqAnswer) === normalize(q.answer);
      return { correct };
    }
    if (q.type === "SHORT_ANSWER") {
      const correct = normalize(shortAnswer) === normalize(q.answer);
      return { correct };
    }
    const correct = normalize(descriptive).includes(normalize(q.answer));
    return { correct };
  }, [submitted, q, mcqAnswer, shortAnswer, descriptive]);

  function resetForNext(nextIndex: number) {
    setActiveIndex(nextIndex);
    setSubmitted(false);
    setMcqAnswer("");
    setShortAnswer("");
    setDescriptive("");
    setShowExplanation(false);
    setNotesOpen(false);
  }

  const masteryPct = Math.round(
    ((activeIndex + (isAnswered ? 1 : 0)) / Math.max(questions.length, 1)) *
      100,
  );

  return (
    <div className={styles.page} aria-label={`Practice for ${topicTitle}`}>
      <StudentTopNav />

      <main className={styles.main}>
        <div className={styles.progressBlock}>
          <div className={styles.progressTop}>
            <div>
              <span className={styles.goalLabel}>DAILY GOAL</span>
              <h3 className={styles.goalValue}>
                {Math.min(20, activeIndex + 1)} / 20 Questions
              </h3>
            </div>
            <div className={styles.timerRow}>
              <Clock3 size={20} />
              <span className={styles.timerText}>14:22</span>
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${masteryPct}%` }}
            />
          </div>
        </div>

        {q ? (
          <section className={styles.practiceStack}>
            <div className={styles.questionCard}>
              <div className={styles.sessionHeader}>
                <span className={styles.quantPill}>{topicTitle}</span>
                <button
                  type="button"
                  className={styles.flagBtn}
                  aria-label="Flag for review"
                >
                  <Flag size={22} />
                </button>
              </div>

              <h1 className={styles.prompt}>{q.prompt}</h1>

              <div className={styles.imagePlaceholder} aria-hidden="true">
                <div className={styles.practiceIllustration}>
                  <span className={styles.railLine} />
                  <span className={styles.trainBody}>
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.optionsGrid}>
              {q.type === "MCQ" ? (
                <>
                  {q.options?.map((opt, idx) => {
                    const checked = mcqAnswer === opt.value;
                    const letter = String.fromCharCode(65 + idx);
                    const showCheck = submitted && checked;
                    const isRightOption =
                      normalize(opt.value) === normalize(q.answer);
                    const stateClass =
                      submitted && checked
                        ? isRightOption
                          ? styles.optionCorrect
                          : styles.optionWrong
                        : "";
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`${styles.optionBtn} ${
                          checked ? styles.optionSelected : ""
                        } ${stateClass}`}
                        onClick={() => {
                          setMcqAnswer(opt.value);
                          setSubmitted(true);
                          setShowExplanation(isRightOption);
                          setNotesOpen(false);
                        }}
                      >
                        <span
                          className={`${styles.letterCircle} ${
                            checked ? styles.letterCircleSelected : ""
                          }`}
                        >
                          {letter}
                        </span>
                        <span className={styles.optionText}>{opt.value}</span>
                        {showCheck ? (
                          <span
                            className={`${styles.checkWrap} ${
                              isRightOption ? styles.checkCorrect : styles.checkWrong
                            }`}
                            aria-hidden="true"
                          >
                            {isRightOption ? <CheckCircle2 size={24} /> : <X size={22} />}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </>
              ) : null}

              {q.type === "SHORT_ANSWER" ? (
                <div className={styles.shortWrap}>
                  <input
                    className={styles.input}
                    value={shortAnswer}
                    placeholder="Type your exact answer"
                    onChange={(e) => setShortAnswer(e.target.value)}
                  />
                  <div className={styles.shortActions}>
                    <button
                      type="button"
                      className={styles.checkBtn}
                      onClick={() => {
                        setSubmitted(true);
                        const correct = normalize(shortAnswer) === normalize(q.answer);
                        setShowExplanation(correct);
                        setNotesOpen(false);
                      }}
                      disabled={!shortAnswer.trim()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : null}

              {q.type === "DESCRIPTIVE" ? (
                <div className={styles.descWrap}>
                  <textarea
                    className={styles.textarea}
                    rows={6}
                    value={descriptive}
                    placeholder="Write your descriptive answer"
                    onChange={(e) => setDescriptive(e.target.value)}
                  />
                  <div className={styles.shortActions}>
                    <button
                      type="button"
                      className={styles.checkBtn}
                      onClick={() => {
                        setSubmitted(true);
                        const correct = normalize(descriptive).includes(normalize(q.answer));
                        setShowExplanation(correct);
                        setNotesOpen(false);
                      }}
                      disabled={!descriptive.trim()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.utilityRow}>
              <button
                type="button"
                className={styles.utilBtn}
                onClick={() => {
                  // Only show explanation when the answer is correct.
                  if (!submitted) return;
                  if (!evaluation?.correct) {
                    setShowExplanation(false);
                    return;
                  }
                  setShowExplanation((v) => !v);
                }}
              >
                Show explanation
              </button>
              <button
                type="button"
                className={styles.utilBtn}
                onClick={() => setNotesOpen((v) => !v)}
              >
                Write note
              </button>
            </div>

            {notesOpen ? (
              <div className={styles.notesCard}>
                <textarea
                  className={styles.notesArea}
                  rows={3}
                  placeholder="Write your note here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            ) : null}

            {submitted && showExplanation ? (
              <div className={styles.explanationCard}>
                <div className={styles.explHead}>
                  <Lightbulb size={24} className={styles.lightbulb} />
                  <h3>Explanation</h3>
                </div>
                <p>
                  {q.type === "MCQ" ? (
                    <>
                      <span className={styles.correctText}>
                        {evaluation?.correct ? "Correct." : "Review."}
                      </span>{" "}
                      {q.explanation}
                    </>
                  ) : q.type === "SHORT_ANSWER" ? (
                    <>
                      {evaluation?.correct ? (
                        <span className={styles.correctText}>
                          Exact match!
                        </span>
                      ) : (
                        <span className={styles.wrongText}>
                          Exact match required.
                        </span>
                      )}{" "}
                      Expected: <strong>{q.answer}</strong>
                      <br />
                      <br />
                      {q.explanation}
                    </>
                  ) : (
                    <>
                      Sample answer:
                      <br />
                      <strong>{q.sampleAnswer ?? q.answer}</strong>
                      <br />
                      <br />
                      {q.explanation}
                    </>
                  )}
                </p>
                <div className={styles.bottomExplainActions}>
                  <button type="button" className={styles.saveBtn}>
                    <Bookmark size={16} />
                    Save to Review
                  </button>
                  <button
                    type="button"
                    className={styles.nextBtn}
                    disabled={activeIndex >= questions.length - 1}
                    onClick={() =>
                      resetForNext(
                        Math.min(questions.length - 1, activeIndex + 1),
                      )
                    }
                  >
                    Next Question
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        ) : (
          <section className={styles.questionCard}>
            <h1 className={styles.prompt}>No questions available.</h1>
          </section>
        )}
      </main>

      <AppFooter />

      <nav className={styles.mobileBottom}>
        <div className={styles.mobileBar}>
          <Link href="/dashboard" className={styles.mobileItem}>
            <Home size={18} />
            <span>Home</span>
          </Link>
          <div className={`${styles.mobileItem} ${styles.mobileActive}`}>
            <Timer size={18} />
            <span>Practice</span>
          </div>
          <Link href="/results" className={styles.mobileItem}>
            <Trophy size={18} />
            <span>Results</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
