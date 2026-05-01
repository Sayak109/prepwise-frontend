"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Flag,
  Home,
  Lightbulb,
  NotebookPen,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { AppFooter } from "@/components/layout/app-footer";
import { StudentTopNav } from "@/components/layout/student-top-nav";
import { addTopicTime, markTopicQuestionSolved } from "@/lib/topic-progress";
import type { Question } from "@/types";
import styles from "@/components/practice/practice-session.module.css";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function answerMatches(question: Question, answer: string) {
  const normalizedAnswer = normalize(answer);
  const normalizedCorrectAnswer = normalize(question.answer);
  if (!normalizedCorrectAnswer) return false;
  if (question.type === "DESCRIPTIVE") {
    return normalizedAnswer.includes(normalizedCorrectAnswer);
  }
  return normalizedAnswer === normalizedCorrectAnswer;
}

export function PracticeSession({
  topicId,
  topicTitle,
  questions,
}: {
  topicId: string;
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

  useEffect(() => {
    if (!topicId || !questions.length) return;

    let lastTickAt = Date.now();
    let pendingSeconds = 0;
    let wasActive =
      document.visibilityState === "visible" && document.hasFocus();

    const flushTime = () => {
      const wholeSeconds = Math.floor(pendingSeconds);
      if (!wholeSeconds) return;
      addTopicTime(topicId, wholeSeconds);
      pendingSeconds -= wholeSeconds;
    };

    const tick = () => {
      const now = Date.now();
      if (wasActive) pendingSeconds += (now - lastTickAt) / 1000;
      lastTickAt = now;
      wasActive =
        document.visibilityState === "visible" && document.hasFocus();
      if (pendingSeconds >= 10) flushTime();
    };

    const handleActivityChange = () => {
      tick();
      flushTime();
    };

    const interval = window.setInterval(tick, 1000);
    document.addEventListener("visibilitychange", handleActivityChange);
    window.addEventListener("blur", handleActivityChange);
    window.addEventListener("focus", handleActivityChange);
    window.addEventListener("beforeunload", handleActivityChange);

    return () => {
      tick();
      flushTime();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleActivityChange);
      window.removeEventListener("blur", handleActivityChange);
      window.removeEventListener("focus", handleActivityChange);
      window.removeEventListener("beforeunload", handleActivityChange);
    };
  }, [topicId, questions.length]);

  const isAnswered = useMemo(() => {
    if (!q) return false;
    if (q.type === "MCQ") return Boolean(mcqAnswer);
    if (q.type === "SHORT_ANSWER") return Boolean(shortAnswer.trim());
    return Boolean(descriptive.trim());
  }, [q, mcqAnswer, shortAnswer, descriptive]);

  const evaluation = useMemo(() => {
    if (!q) return null;
    const answer =
      q.type === "MCQ"
        ? mcqAnswer
        : q.type === "SHORT_ANSWER"
          ? shortAnswer
          : descriptive;
    return { correct: answerMatches(q, answer) };
  }, [q, mcqAnswer, shortAnswer, descriptive]);

  function resetForNext(nextIndex: number) {
    setActiveIndex(nextIndex);
    setSubmitted(false);
    setMcqAnswer("");
    setShortAnswer("");
    setDescriptive("");
    setShowExplanation(false);
    setNotesOpen(false);
  }

  function submitAnswer() {
    if (!topicId || !q || !isAnswered) return;
    setSubmitted(true);
    setShowExplanation(answerMatches(
      q,
      q.type === "MCQ"
        ? mcqAnswer
        : q.type === "SHORT_ANSWER"
          ? shortAnswer
          : descriptive,
    ));
    setNotesOpen(false);
    markTopicQuestionSolved(topicId, q.id);
  }

  function moveToNextQuestion() {
    if (isAnswered) submitAnswer();
    resetForNext(Math.min(questions.length - 1, activeIndex + 1));
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
              <span className={styles.goalLabel}>{topicTitle}</span>
              <h3 className={styles.goalValue}>
                Question {activeIndex + 1} of {questions.length}
              </h3>
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
                          setSubmitted(false);
                          setShowExplanation(false);
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
                    onChange={(e) => {
                      setShortAnswer(e.target.value);
                      setSubmitted(false);
                      setShowExplanation(false);
                    }}
                  />
                </div>
              ) : null}

              {q.type === "DESCRIPTIVE" ? (
                <div className={styles.descWrap}>
                  <textarea
                    className={styles.textarea}
                    rows={6}
                    value={descriptive}
                    placeholder="Write your descriptive answer"
                    onChange={(e) => {
                      setDescriptive(e.target.value);
                      setSubmitted(false);
                      setShowExplanation(false);
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div className={styles.answerActions}>
              <button
                type="button"
                className={styles.checkBtn}
                onClick={submitAnswer}
                disabled={!isAnswered || submitted}
              >
                {submitted ? "Submitted" : "Submit"}
              </button>
              <button
                type="button"
                className={styles.nextBtn}
                onClick={moveToNextQuestion}
                disabled={activeIndex >= questions.length - 1}
              >
                Next
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </div>

            <div className={styles.utilityRow}>
              <button
                type="button"
                className={styles.utilBtn}
                onClick={() => {
                  setShowExplanation((v) => !v);
                }}
                aria-pressed={showExplanation}
              >
                <Lightbulb size={16} aria-hidden="true" />
                Show explanation
              </button>
              <button
                type="button"
                className={styles.utilBtn}
                onClick={() => setNotesOpen((v) => !v)}
                aria-pressed={notesOpen}
              >
                <NotebookPen size={16} aria-hidden="true" />
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

            {showExplanation ? (
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
                    onClick={moveToNextQuestion}
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
