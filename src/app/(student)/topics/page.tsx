"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, MoreVertical, Search, Timer } from "lucide-react";
import { useTopics } from "@/hooks/use-topics";

import { StudentTopNav } from "@/components/layout/student-top-nav";
import { AppFooter } from "@/components/layout/app-footer";
import {
  formatTopicTime,
  getTopicProgress,
  readTopicProgress,
  topicMasteryPercent,
  topicSolvedCount,
  TOPIC_PROGRESS_EVENT,
  type TopicProgressMap,
} from "@/lib/topic-progress";
import styles from "@/app/(student)/topics/topics-exploration.module.css";

const imagesByTopicId: Record<string, string> = {
  "t-math":
    "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=80",
  "t-geo":
    "https://images.unsplash.com/photo-1523721308447-ff3f1c1a6b3e?auto=format&fit=crop&w=900&q=80",
  "t-phy":
    "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
  "t-chem":
    "https://images.unsplash.com/photo-1581092160607-7cfa1a6f6d0b?auto=format&fit=crop&w=900&q=80",
  "t-eng":
    "https://images.unsplash.com/photo-1456519671631-5d8f0bb8efca?auto=format&fit=crop&w=900&q=80",
};

function masteryLevel(mastery: number) {
  if (mastery >= 70) return { level: "Advanced", labelColor: "advanced" };
  if (mastery >= 30) return { level: "Core", labelColor: "core" };
  return { level: "Fundamental", labelColor: "fundamental" };
}

export default function TopicsPage() {
  const { data, isLoading } = useTopics();

  const [query, setQuery] = useState("");
  const [progress, setProgress] = useState<TopicProgressMap>(() =>
    readTopicProgress(),
  );

  useEffect(() => {
    const handleProgress = () => setProgress(readTopicProgress());
    window.addEventListener(TOPIC_PROGRESS_EVENT, handleProgress);
    window.addEventListener("storage", handleProgress);
    return () => {
      window.removeEventListener(TOPIC_PROGRESS_EVENT, handleProgress);
      window.removeEventListener("storage", handleProgress);
    };
  }, []);

  const filteredTopics = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => {
      const hay = `${t.title} ${t.description}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, query]);

  return (
    <div className={styles.page}>
      <StudentTopNav />

      <main className={styles.main}>
        <header className={styles.hero}>
          <h1>Subject Library</h1>
          <p>
            Master every concept through structured topic exploration. Tracks
            your progress across various domains with real-time analytics.
          </p>

          <div className={styles.heroActions}>
            <button className={styles.secondaryBtn} type="button">
              <Sliders /> Filter
            </button>
            <Link className={styles.primaryBtn} href="/tests">
              New Test
            </Link>
          </div>
        </header>

        <div className={styles.searchRow}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subjects..."
              aria-label="Search subjects"
            />
          </div>
        </div>

        {isLoading ? (
          <p className={styles.loading}>Loading topics...</p>
        ) : null}

        <section className={styles.grid} aria-label="Topic library">
          {filteredTopics.map((topic) => {
            const topicProgress = getTopicProgress(topic.id, progress);
            const questionCount = topic.questionCount ?? 0;
            const solvedCount = topicSolvedCount(
              topicProgress.solvedQuestionIds,
              questionCount,
            );
            const masteryPct = topicMasteryPercent(solvedCount, questionCount);
            const stats = masteryLevel(masteryPct);
            const ctaLabel = masteryPct >= 85 ? "Review Results" : "Start Practice";

            return (
              <article key={topic.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={topic.title}
                    src={imagesByTopicId[topic.id] ?? imagesByTopicId["t-math"]}
                  />
                </div>

                <div className={styles.cardTop}>
                  <div className={styles.badgeWrap}>
                    <span
                      className={`${styles.labelCaps} ${
                        stats.labelColor === "advanced"
                          ? styles.labelAdvanced
                          : stats.labelColor === "fundamental"
                            ? styles.labelFundamental
                            : styles.labelCore
                      }`}
                    >
                      {stats.level}
                    </span>
                    <h3 className={styles.cardTitle}>{topic.title}</h3>
                  </div>
                  <MoreVertical size={18} className={styles.moreIcon} />
                </div>

                <div className={styles.masteryRow}>
                  <span className={styles.masteryLabel}>Mastery</span>
                  <strong className={styles.masteryValue}>{masteryPct}%</strong>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${masteryPct}%` }}
                  />
                </div>

                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <GraduationCap size={16} />
                    {questionCount} {questionCount === 1 ? "Question" : "Questions"}
                  </span>
                  <span className={styles.metaItem}>
                    <Timer size={16} />
                    {formatTopicTime(topicProgress.timeSpentSeconds)} spent
                  </span>
                </div>

                <div className={styles.ctaWrap}>
                  {ctaLabel === "Review Results" ? (
                    <Link className={styles.reviewBtn} href={`/results`}>
                      {ctaLabel}
                    </Link>
                  ) : (
                    <Link className={styles.primaryBtnFull} href={`/practice/${topic.id}`}>
                      {ctaLabel}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <AppFooter />
    </div>
  );
}

function Sliders() {
  // local icon wrapper to keep JSX clean
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 21v-7m0-4V3m10 18v-9m0-4V3m6 18v-5m0-4V3"
        stroke="#1f108e"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="4" cy="14" r="2" fill="#1f108e" />
      <circle cx="14" cy="12" r="2" fill="#1f108e" />
      <circle cx="20" cy="16" r="2" fill="#1f108e" />
    </svg>
  );
}
