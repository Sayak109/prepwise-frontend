import { StudentLayout } from "@/components/layout/student-layout";
import Link from "next/link";
import styles from "@/app/(student)/dashboard/dashboard.module.css";
import { ArrowRight, Flame, Sigma } from "lucide-react";
import { fetchDashboard } from "@/services/server-student-api";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const [session, dashboard] = await Promise.all([getSession(), fetchDashboard()]);
  const activeUser = session.user;
  const recent = dashboard.recentAttempts.slice(0, 3);
  const testsCompleted = dashboard.stats.testsCompleted;
  const testsGoal = Math.max(dashboard.stats.totalTests, 1);
  const testsPct = dashboard.stats.testsCompletedPercent;
  const streakDays = dashboard.stats.studyStreak.currentDays;
  const overallScore = dashboard.stats.overallScore;

  return (
    <StudentLayout>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <h1>Good morning, {activeUser?.name ?? "Student"}.</h1>
          <p>You&apos;re making great progress. Ready to tackle today&apos;s goals?</p>
        </header>

        <section className={styles.metrics} aria-label="Core metrics">
          <article className={styles.card}>
            <p className={styles.label}>Overall Score</p>
            <div className={styles.valueRow}>
              <span className={styles.valuePrimary}>{overallScore}</span>
              <span className={styles.unit}>%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${overallScore}%` }} />
            </div>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>Tests Completed</p>
            <div className={styles.valueRow}>
              <span className={styles.valueNeutral}>{testsCompleted}</span>
              <span className={styles.unit}>/ {testsGoal}</span>
            </div>
            <div className={styles.subRow}>
              <Sigma size={16} color="#1f108e" />
              <span>{testsPct}% of goal</span>
            </div>
          </article>

          <article className={styles.card}>
            <p className={styles.label}>Study Streak</p>
            <div className={styles.valueRow}>
              <span className={styles.streakNum}>{streakDays}</span>
              <span className={styles.unit}>days</span>
            </div>
            <div className={styles.subRow} style={{ color: "#752c00" }}>
              <Flame size={16} />
              <span>Personal Best</span>
            </div>
          </article>
        </section>

        <section className={styles.recommend} aria-label="Recommended goal">
          <div className={styles.recImg}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Recommended topic"
              src="https://images.unsplash.com/photo-1532635224-8fe0b757fb13?auto=format&fit=crop&w=1400&q=80"
            />
          </div>
          <div className={styles.recBody}>
            <span className={styles.pill}>Recommended Goal</span>
            <h2>Master your next weak topic</h2>
            <p>
              Based on your recent practice, focusing on this topic can boost your score by an
              estimated 5%.
            </p>
            <div className={styles.recActions}>
              <Link className={styles.primaryBtn} href="/topics">
                Start Practice <ArrowRight size={16} />
              </Link>
              <span className={styles.hint}>Estimated time: 25 mins</span>
            </div>
          </div>
        </section>

        <section aria-label="Recent attempts">
          <div className={styles.sectionHead}>
            <h3>Recent Attempts</h3>
            <button className={styles.linkBtn} type="button">
              View All History
            </button>
          </div>

          <div className={styles.attempts}>
            {recent.map((a) => {
              const pct = a.scorePercent;
              const status = pct >= 85 ? "Mastered" : a.result === "PASSED" ? "Passed" : "Incomplete";
              const statusClass =
                status === "Passed" ? styles.passed : status === "Mastered" ? styles.mastered : styles.incomplete;

              return (
                <article key={a.id} className={styles.attemptItem}>
                  <div className={styles.attemptLeft}>
                    <div className={styles.attemptIcon}>
                      <Sigma size={18} />
                    </div>
                    <div>
                      <p className={styles.attemptTitle}>{a.title}</p>
                      <p className={styles.attemptSub}>{a.attemptedDate}</p>
                    </div>
                  </div>

                  <div className={styles.attemptRight}>
                    <p className={styles.attemptScore}>{pct}%</p>
                    <span className={`${styles.statusPill} ${statusClass}`}>{status}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}
