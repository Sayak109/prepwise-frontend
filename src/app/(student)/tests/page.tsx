"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  Clock3,
  FileText,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useTests } from "@/hooks/use-tests";
import styles from "@/app/(student)/tests/tests-listing.module.css";
import { FetchLoadingBlock } from "@/components/feedback/fetch-loading-block";
import { AppFooter } from "@/components/layout/app-footer";
import { StudentTopNav } from "@/components/layout/student-top-nav";
import type { Test } from "@/types";

type DurationFilter =
  | "UNDER_15"
  | "BETWEEN_15_30"
  | "BETWEEN_30_50"
  | "OVER_50";

const difficultyOptions: Array<{ label: string; value: Test["difficulty"] }> = [
  { label: "Beginner", value: "EASY" },
  { label: "Intermediate", value: "MEDIUM" },
  { label: "Advanced", value: "HARD" },
];

const durationOptions: Array<{ label: string; value: DurationFilter }> = [
  { label: "Under 15m", value: "UNDER_15" },
  { label: "15m - 30m", value: "BETWEEN_15_30" },
  { label: "30m - 50m", value: "BETWEEN_30_50" },
  { label: "Over 50m", value: "OVER_50" },
];

function difficultyLabel(difficulty?: Test["difficulty"]) {
  if (difficulty === "EASY") return "Beginner Level";
  if (difficulty === "MEDIUM") return "Intermediate Level";
  if (difficulty === "HARD") return "Advanced Level";
  return "Practice Level";
}

function durationMatches(duration: number, filter?: DurationFilter) {
  if (!filter) return true;
  if (filter === "UNDER_15") return duration < 15;
  if (filter === "BETWEEN_15_30") return duration >= 15 && duration <= 30;
  if (filter === "BETWEEN_30_50") return duration > 30 && duration <= 50;
  return duration > 50;
}

export default function TestsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [difficulty, setDifficulty] = useState<
    Test["difficulty"] | undefined
  >();
  const [duration, setDuration] = useState<DurationFilter | undefined>();
  const { data, isLoading } = useTests({ search: debouncedSearch, difficulty });

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(search.trim()),
      350,
    );
    return () => window.clearTimeout(timeout);
  }, [search]);

  const cards = useMemo(
    () =>
      (data ?? [])
        .map((test) => ({
          id: test.id,
          title: test.title,
          category: test.premium ? "Premium" : "Mock Test",
          questions: test.questionCount ?? test.questionIds.length,
          duration: test.durationMinutes,
          level: difficultyLabel(test.difficulty),
          difficulty: test.difficulty,
          premium: test.premium,
          href: `/tests/${test.id}`,
        }))
        .filter((test) => durationMatches(test.duration, duration)),
    [data, duration],
  );

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setDifficulty(undefined);
    setDuration(undefined);
  }

  return (
    <div className={styles.page}>
      <StudentTopNav />

      <div className={styles.bodyWrap}>
        <aside className={styles.sidebar}>
          <div className={styles.stickyCard}>
            <h2>Filters</h2>
            <div className={styles.filterGroup}>
              <h3>Difficulty</h3>
              {difficultyOptions.map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    checked={difficulty === option.value}
                    onChange={() =>
                      setDifficulty((current) =>
                        current === option.value ? undefined : option.value,
                      )
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <div className={styles.filterGroup}>
              <h3>Duration</h3>
              {durationOptions.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name="duration"
                    checked={duration === option.value}
                    onChange={() => setDuration(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <div className={styles.filterGroup}>
              <h3>Price</h3>
              <label>
                <input type="checkbox" />
                Free
              </label>
              <label>
                <input type="checkbox" />
                Premium (Pro)
              </label>
            </div>
            <button
              className={styles.clearBtn}
              type="button"
              onClick={clearFilters}
            >
              <SlidersHorizontal size={14} />
              Clear All Filters
            </button>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.headBlock}>
            <h1>Available Mock Test</h1>
            <div className={styles.searchWrap}>
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by exam name, topic, or keyword..."
              />
            </div>
          </div>

          {isLoading ? <FetchLoadingBlock message="Loading mock tests…" className="py-12" /> : null}

          <div className={styles.grid}>
            {cards.map((card, idx) => (
              <article key={card.id} className={styles.examCard}>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <span className={styles.badge}>{card.category}</span>
                    <button className={styles.bookmarkBtn}>
                      <Bookmark
                        size={18}
                        fill={idx === 2 ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                  <h3>{card.title}</h3>
                  <div className={styles.meta}>
                    <p>
                      <FileText size={16} />
                      {card.questions} Questions
                    </p>
                    <p>
                      <Clock3 size={16} />
                      {card.duration} Minutes
                    </p>
                    <p>
                      <SlidersHorizontal size={16} />
                      {card.level}
                    </p>
                  </div>
                </div>
                <Link href={card.href} className={styles.startBtn}>
                  Start Test
                </Link>
              </article>
            ))}

            {!isLoading && !cards.length ? (
              <p className={styles.emptyState}>No tests match your filters.</p>
            ) : null}

            <section className={styles.callout}>
              <div className={styles.calloutOverlay}>
                <span>New Content</span>
                <h4>Data Science Essentials for Beginners</h4>
                <button>Explore Topic</button>
              </div>
            </section>
          </div>
        </main>
      </div>

      <AppFooter />
    </div>
  );
}
