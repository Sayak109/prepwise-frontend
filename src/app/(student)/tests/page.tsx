"use client";
import Link from "next/link";
import { Bell, Bookmark, CircleHelp, Clock3, FileText, Search, SlidersHorizontal } from "lucide-react";
import { useTests } from "@/hooks/use-tests";
import styles from "@/app/(student)/tests/tests-listing.module.css";
import { StudentTopNav } from "@/components/layout/student-top-nav";

const curatedCards = [
  { id: "c1", title: "SAT Mock Test #5", category: "Mock Exams", questions: 154, duration: 180, level: "Advanced Level", premium: false },
  { id: "c2", title: "Advanced Calculus Midterm", category: "Mathematics", questions: 25, duration: 90, level: "Expert Level", premium: true },
  { id: "c3", title: "Organic Chemistry Quiz", category: "Science", questions: 40, duration: 45, level: "Intermediate Level", premium: false },
  { id: "c4", title: "Modern History Analysis", category: "Humanities", questions: 60, duration: 120, level: "Intermediate Level", premium: false },
];

export default function TestsPage() {
  const { data, isLoading } = useTests();
  const apiCards = (data ?? []).map((test, index) => ({
    id: test.id,
    title: test.title,
    category: test.premium ? "Premium" : "Practice",
    questions: test.questionIds.length,
    duration: test.durationMinutes,
    level: index % 2 === 0 ? "Intermediate Level" : "Advanced Level",
    premium: test.premium,
    href: `/tests/${test.id}`,
  }));

  const cards = [...apiCards, ...curatedCards.map((c) => ({ ...c, href: "/tests/test-1" }))];

  return (
    <div className={styles.page}>
      <StudentTopNav
        rightSlot={
          <>
            <button className={styles.proButton}>Upgrade Pro</button>
            <div className={styles.iconWrap}>
              <Bell size={18} />
              <CircleHelp size={18} />
            </div>
            <div className={styles.avatar} />
          </>
        }
      />

      <div className={styles.bodyWrap}>
        <aside className={styles.sidebar}>
          <div className={styles.stickyCard}>
            <h2>Filters</h2>
            <div className={styles.filterGroup}>
              <h3>Subject</h3>
              <label><input type="checkbox" defaultChecked />All Subjects</label>
              <label><input type="checkbox" />Mathematics</label>
              <label><input type="checkbox" />Science</label>
              <label><input type="checkbox" />Mock Exams</label>
            </div>
            <div className={styles.filterGroup}>
              <h3>Difficulty</h3>
              <label><input type="checkbox" />Beginner</label>
              <label><input type="checkbox" />Intermediate</label>
              <label><input type="checkbox" />Advanced</label>
            </div>
            <div className={styles.filterGroup}>
              <h3>Duration</h3>
              <label><input type="radio" name="duration" />Under 45m</label>
              <label><input type="radio" name="duration" />45m - 90m</label>
              <label><input type="radio" name="duration" />Over 90m</label>
            </div>
            <div className={styles.filterGroup}>
              <h3>Price</h3>
              <label><input type="checkbox" />Free</label>
              <label><input type="checkbox" />Premium (Pro)</label>
            </div>
            <button className={styles.clearBtn}><SlidersHorizontal size={14} />Clear All Filters</button>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.headBlock}>
            <h1>Available Exams</h1>
            <div className={styles.searchWrap}>
              <Search size={17} />
              <input placeholder="Search by exam name, topic, or keyword..." />
            </div>
          </div>

          {isLoading ? <p className={styles.loading}>Loading exams...</p> : null}

          <div className={styles.grid}>
            {cards.slice(0, 3).map((card, idx) => (
              <article key={card.id} className={styles.examCard}>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <span className={styles.badge}>{card.category}</span>
                    <button className={styles.bookmarkBtn}>
                      <Bookmark size={18} fill={idx === 2 ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <h3>{card.title}</h3>
                  <div className={styles.meta}>
                    <p><FileText size={16} />{card.questions} Questions</p>
                    <p><Clock3 size={16} />{card.duration} Minutes</p>
                    <p><SlidersHorizontal size={16} />{card.level}</p>
                  </div>
                </div>
                <Link href={card.href} className={styles.startBtn}>Start Test</Link>
              </article>
            ))}

            <section className={styles.callout}>
              <div className={styles.calloutOverlay}>
                <span>New Content</span>
                <h4>Data Science Essentials for Beginners</h4>
                <button>Explore Topic</button>
              </div>
            </section>

            {cards.slice(3, 4).map((card) => (
              <article key={card.id} className={styles.examCard}>
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <span className={styles.badge}>{card.category}</span>
                    <button className={styles.bookmarkBtn}><Bookmark size={18} /></button>
                  </div>
                  <h3>{card.title}</h3>
                  <div className={styles.meta}>
                    <p><FileText size={16} />{card.questions} Questions</p>
                    <p><Clock3 size={16} />{card.duration} Minutes</p>
                    <p><SlidersHorizontal size={16} />{card.level}</p>
                  </div>
                </div>
                <Link href={card.href} className={styles.startBtn}>Start Test</Link>
              </article>
            ))}
          </div>
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span>PrepWise</span>
          <p>© 2024 PrepWise Adaptive Exam Systems. All rights reserved.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
